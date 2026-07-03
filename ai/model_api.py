"""
JALA - AI Model API (Prediksi Demand Penumpang)
--------------------------------------------------
Serve model RandomForestRegressor (model_jaklingko.joblib) sebagai REST API,
supaya bisa dipanggil dari dashboard React / backend Node.js (server.js).

Input model:  hari (0=Senin ... 6=Minggu), jam (5-22)
Output model: estimasi_permintaan (perkiraan jumlah penumpang menunggu, skala 1-15)

Cara jalanin:
  1. pip install flask joblib scikit-learn pandas
  2. python model_api.py
  3. Server jalan di http://localhost:5000

Endpoint:
  GET /predict?hari=0&jam=8        -> prediksi untuk 1 kombinasi hari & jam
  GET /predict/now                  -> prediksi otomatis pakai waktu saat ini
  GET /predict/heatmap               -> prediksi untuk SEMUA kombinasi hari & jam
                                         (dipakai untuk bikin heatmap di dashboard)
"""

from flask import Flask, request, jsonify
import joblib
import pandas as pd
from datetime import datetime

app = Flask(__name__)

model = joblib.load("model_jaklingko.joblib")

NAMA_HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]

@app.after_request
def tambah_cors_header(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


def prediksi_satu(hari: int, jam: int) -> float:
    """Prediksi 1 kombinasi hari+jam, return nilai float estimasi permintaan."""
    X = pd.DataFrame([[hari, jam]], columns=["hari", "jam"])
    hasil = model.predict(X)[0]
    return round(float(hasil), 2)


def level_kepadatan(nilai: float) -> str:
    """Konversi angka prediksi jadi label kepadatan yang mudah dibaca."""
    if nilai >= 10:
        return "TINGGI"
    elif nilai >= 5:
        return "SEDANG"
    else:
        return "RENDAH"


@app.route("/predict", methods=["GET"])
def predict():
    try:
        hari = int(request.args.get("hari"))
        jam = int(request.args.get("jam"))
    except (TypeError, ValueError):
        return jsonify({"error": "Parameter 'hari' (0-6) dan 'jam' (5-22) wajib diisi angka."}), 400

    if not (0 <= hari <= 6) or not (5 <= jam <= 22):
        return jsonify({"error": "hari harus 0-6, jam harus 5-22."}), 400

    nilai = prediksi_satu(hari, jam)

    return jsonify({
        "hari": hari,
        "nama_hari": NAMA_HARI[hari],
        "jam": jam,
        "estimasi_permintaan": nilai,
        "level_kepadatan": level_kepadatan(nilai),
    })


@app.route("/predict/now", methods=["GET"])
def predict_now():
    now = datetime.now()
    hari = now.weekday()  # 0=Senin
    jam = now.hour

    # Kalau di luar jam operasional (5-22), kembalikan info tanpa prediksi
    if not (5 <= jam <= 22):
        return jsonify({
            "hari": hari,
            "nama_hari": NAMA_HARI[hari],
            "jam": jam,
            "estimasi_permintaan": 0,
            "level_kepadatan": "TUTUP",
            "catatan": "Di luar jam operasional (05:00-22:00)",
        })

    nilai = prediksi_satu(hari, jam)

    return jsonify({
        "hari": hari,
        "nama_hari": NAMA_HARI[hari],
        "jam": jam,
        "estimasi_permintaan": nilai,
        "level_kepadatan": level_kepadatan(nilai),
    })


@app.route("/predict/heatmap", methods=["GET"])
def predict_heatmap():
    """Prediksi untuk semua kombinasi hari (0-6) x jam (5-22), buat heatmap dashboard."""
    hasil = []
    for hari in range(7):
        for jam in range(5, 23):
            nilai = prediksi_satu(hari, jam)
            hasil.append({
                "hari": hari,
                "nama_hari": NAMA_HARI[hari],
                "jam": jam,
                "estimasi_permintaan": nilai,
                "level_kepadatan": level_kepadatan(nilai),
            })

    return jsonify(hasil)


if __name__ == "__main__":
    print("=== JALA Model API ===")
    print("Model berhasil dimuat. Server jalan di http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)