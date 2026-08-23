from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import base64
import cv2
import os
from deepface import DeepFace

app = FastAPI()

# Izinkan React mengakses server Python ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FaceVerifyRequest(BaseModel):
    image_base64: str      # Foto dari webcam React
    stored_vector: list    # 128 array dari Laravel (Face Encoding)

@app.post("/verify-face")
async def verify_face(data: FaceVerifyRequest):
    try:
        # 1. Dekode gambar base64 menjadi format OpenCV
        header, encoded = data.image_base64.split(",", 1)
        nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Simpan sementara foto dari webcam untuk diproses DeepFace
        temp_filename = "temp_login.jpg"
        cv2.imwrite(temp_filename, img)

        # 2. Ekstrak encoding dari wajah di kamera menggunakan DeepFace
        # Kita gunakan model 'Facenet' karena biasanya menghasilkan 128/512 d-vector
        objs = DeepFace.represent(img_path=temp_filename, model_name="Facenet", enforce_detection=False)
        
        if not objs:
            return {"success": False, "message": "Wajah tidak terdeteksi"}

        current_vector = objs[0]["embedding"]

        # 3. Hitung Jarak Cosine (Cosine Distance) antara dua vector
        # Rumus matematika untuk membandingkan kemiripan vector
        a = np.array(current_vector)
        b = np.array(data.stored_vector)
        
        # Hitung dot product dan norma
        cos_sim = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
        
        # Threshold: biasanya jika > 0.40 maka dianggap orang yang sama
        is_match = cos_sim > 0.40 

        # Hapus file sementara
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

        return {
            "success": bool(is_match),
            "score": float(cos_sim),
            "message": "Verifikasi Berhasil" if is_match else "Wajah Tidak Cocok"
        }
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Gagal memproses biometrik")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)