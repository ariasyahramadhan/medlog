from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import base64
import cv2
import os
from deepface import DeepFace

app = FastAPI()

# Konfigurasi CORS agar React (Vite/CRA) bisa mengakses server ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schema ────────────────────────────────────────────────────────────────────

class FaceRegisterRequest(BaseModel):
    image_base64: str

class DosenEntry(BaseModel):
    identifier:  str
    face_vector: list   # embedding dari database Laravel

class FaceVerifyRequest(BaseModel):
    image_base64: str               # Foto baru dari webcam
    dosen_list:   list[DosenEntry]  # Semua dosen beserta vectornya

# ── Helper ────────────────────────────────────────────────────────────────────

def decode_image(image_base64: str):
    """Dekode base64 → numpy array (BGR)."""
    _, encoded = image_base64.split(",", 1)
    nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

def cosine_similarity(a: list, b: list) -> float:
    """Hitung cosine similarity antara dua vector."""
    va = np.array(a, dtype=np.float64)
    vb = np.array(b, dtype=np.float64)
    denom = np.linalg.norm(va) * np.linalg.norm(vb)
    if denom == 0:
        return 0.0
    return float(np.dot(va, vb) / denom)

# ── Endpoint 1: Ekstraksi (Registrasi Biometrik) ──────────────────────────────

@app.post("/extract-face")
async def extract_face(data: FaceRegisterRequest):
    print(f"\n[EXTRACT-FACE] Menerima request ekstraksi vektor wajah...")
    try:
        img  = decode_image(data.image_base64)
        print(f"[EXTRACT-FACE] Gambar terdekode: shape {img.shape}")
        
        objs = DeepFace.represent(
            img_path=img,
            model_name="Facenet",
            enforce_detection=True,
            detector_backend="opencv"
        )

        if not objs:
            print("[EXTRACT-FACE] ❌ Gagal: Wajah tidak terdeteksi oleh detector OpenCV.")
            return {"success": False, "message": "Wajah tidak terdeteksi dalam foto. Pastikan pencahayaan cukup dan wajah menghadap lurus ke kamera."}

        print(f"[EXTRACT-FACE] ✅ Sukses mengekstrak vector embedding ({len(objs[0]['embedding'])} dimensi).")
        return {
            "success": True,
            "vector":  objs[0]["embedding"]
        }
    except Exception as e:
        print(f"[EXTRACT-FACE] ❌ Error: {e}")
        return {"success": False, "message": f"Gagal memproses wajah: {str(e)}"}

@app.post("/detect-face")
async def detect_face(data: FaceRegisterRequest):
    print(f"\n[DETECT-FACE] Menerima request validasi foto presensi...")
    try:
        img = decode_image(data.image_base64)
        print(f"[DETECT-FACE] Gambar terdekode: shape {img.shape}")
        
        objs = DeepFace.represent(
            img_path=img,
            model_name="Facenet",
            enforce_detection=True,
            detector_backend="opencv"
        )
        if not objs:
            print("[DETECT-FACE] ❌ Wajah tidak terdeteksi dalam foto presensi.")
            return {
                "face_detected": False, 
                "message": "Wajah tidak terdeteksi. Pastikan pencahayaan terang dan seluruh wajah terlihat jelas."
            }
        
        print(f"[DETECT-FACE] ✅ Wajah terdeteksi dengan baik pada foto presensi.")
        return {"face_detected": True, "message": "Wajah terdeteksi"}
    except Exception as e:
        print(f"[DETECT-FACE] ⚠️ Exception: {e}")
        return {
            "face_detected": False, 
            "message": f"Wajah tidak terdeteksi atau foto buram: {str(e)}"
        }

# ── Endpoint 2: Verifikasi (Login Biometrik) ──────────────────────────────────

@app.post("/verify-face")
async def verify_face(data: FaceVerifyRequest):
    print(f"\n[VERIFY-FACE] Menerima request verifikasi login biometrik ({len(data.dosen_list)} data dosen terdaftar)...")
    try:
        # 1. Dekode & ekstrak embedding wajah dari kamera
        img  = decode_image(data.image_base64)
        print(f"[VERIFY-FACE] Gambar terdekode: shape {img.shape}")
        
        objs = DeepFace.represent(
            img_path=img,
            model_name="Facenet",
            enforce_detection=False,
            detector_backend="opencv"
        )

        if not objs:
            print("[VERIFY-FACE] ❌ Wajah tidak terdeteksi pada webcam.")
            return {"success": False, "message": "Wajah tidak terdeteksi di kamera"}

        current_vector = objs[0]["embedding"]

        # 2. Bandingkan dengan semua dosen, cari skor tertinggi
        best_score      = -1.0
        best_identifier = None

        print("[VERIFY-FACE] Menghitung kemiripan terhadap daftar dosen:")
        for dosen in data.dosen_list:
            score = cosine_similarity(current_vector, dosen.face_vector)
            print(f"  • {dosen.identifier} -> Cosine Similarity: {score:.4f}")
            if score > best_score:
                best_score      = score
                best_identifier = dosen.identifier

        # 3. Threshold: Facenet cosine similarity (0.65 - 0.70 adalah threshold optimal)
        THRESHOLD = float(os.getenv("FACE_MATCH_THRESHOLD", "0.70"))
        is_match  = best_score >= THRESHOLD

        print(f"[VERIFY-FACE] Hasil terbaik: {best_identifier} | Skor: {best_score:.4f} | Target Minimal: {THRESHOLD:.4f}")

        if is_match:
            print(f"[VERIFY-FACE] ✅ MATCH DITEMUKAN! Pengguna diverifikasi sebagai {best_identifier}")
            return {
                "success":    True,
                "identifier": best_identifier,
                "score":      round(best_score, 4),
                "threshold":  THRESHOLD,
                "message":    "Verifikasi Berhasil"
            }
        else:
            print(f"[VERIFY-FACE] ❌ DITOLAK: Skor {best_score:.4f} di bawah threshold {THRESHOLD:.4f}")
            return {
                "success": False,
                "score":   round(best_score, 4),
                "threshold": THRESHOLD,
                "message": f"Wajah tidak cocok dengan data terdaftar (Skor: {best_score:.2f} / Target: {THRESHOLD:.2f})"
            }

    except Exception as e:
        print(f"[VERIFY-FACE] ❌ Error Exception: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses biometrik: {str(e)}")

# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)