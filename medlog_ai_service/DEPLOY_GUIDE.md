# Panduan Deploy medlog_ai_service di cPanel

## Root Cause: ModuleNotFoundError 'a2wsgi'

passenger_debug.log menunjukkan error: **ModuleNotFoundError: No module named 'a2wsgi'**

Artinya virtualenv sudah dibuat oleh cPanel, tapi dependency **belum pernah diinstall** ke dalamnya.

---

## Langkah 1 — Upload File ke cPanel

Upload file-file berikut ke folder medlog_ai_service di server:

- main.py
- passenger_wsgi.py (sudah diperbarui)
- equirements.txt

Bisa via **File Manager cPanel** atau **FTP/SFTP**.

---

## Langkah 2 — Install Dependency via cPanel

1. Buka **cPanel → Setup Python App**
2. Temukan aplikasi i.sigmaeducation.id
3. Klik tombol **"Edit"** (ikon pensil)
4. Scroll ke bawah, temukan bagian **"Execute python script"** atau **"pip install"**
5. Di kolom **"Pip install modules"**, masukkan:
   `
   fastapi uvicorn[standard] opencv-python-headless numpy python-multipart a2wsgi
   `
6. Klik **"Run pip install"**

**Atau** via Terminal SSH (lebih andal):
`ash
source ~/virtualenv/medlog_ai_service/3.11/bin/activate
pip install -r ~/public_html/medlog_ai_service/requirements.txt
`

---

## Langkah 3 — Restart Aplikasi

Di cPanel → Setup Python App → klik **"Restart"** pada aplikasi.

---

## Langkah 4 — Verifikasi

Buka: https://ai.sigmaeducation.id/

Seharusnya muncul:
`json
{"status": "ok", "service": "Medlog Face Detection Service", "version": "2.0.0"}
`

Jika masih error, buka passenger_debug.log untuk melihat traceback detail.

---

## Troubleshooting: Jika Masih 503

### Kemungkinan A: opencv tidak kompatibel

Jika log menunjukkan error terkait libGL.so atau cv2:

Edit equirements.txt, ubah opencv-python-headless → sudah headless, biasanya OK.
Jika masih error, coba via SSH:
`ash
source ~/virtualenv/medlog_ai_service/3.11/bin/activate
pip install opencv-python-headless --force-reinstall
`

### Kemungkinan B: Path virtualenv berbeda

Cek path virtualenv aktual via SSH:
`ash
ls ~/virtualenv/
`
Lalu sesuaikan path di passenger_wsgi.py baris _inject_venv().

### Kemungkinan C: Passenger tidak reload

Di cPanel → Setup Python App → klik Stop lalu Start (bukan Restart).

---

## Konfigurasi cPanel yang Benar

| Field | Value |
|-------|-------|
| Python version | 3.11.15 |
| Application root | medlog_ai_service |
| Application URL | ai.sigmaeducation.id |
| Application startup file | passenger_wsgi.py |
| Application Entry point | application |

