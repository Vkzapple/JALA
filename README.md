# JALA — JakLingko Auto-Locate Assistant

> **LKS Kecakapan Keahlian (KA) 2026 · Bidang Kecerdasan Artifisial**  
> Tema: **Komunitas** — Membantu masyarakat mengakses informasi dan dukungan sosial.

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Latar Belakang & Masalah](#2-latar-belakang--masalah)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Komponen Hardware (IoT Node)](#4-komponen-hardware-iot-node)
5. [Komponen Software](#5-komponen-software)
6. [Fitur AI & Penjelasan Teknis](#6-fitur-ai--penjelasan-teknis)
7. [Responsible AI](#7-responsible-ai)
8. [Dataset yang Digunakan](#8-dataset-yang-digunakan)
9. [Cara Menjalankan Sistem](#9-cara-menjalankan-sistem)
10. [Struktur Folder](#10-struktur-folder)
11. [API Reference](#11-api-reference)
12. [Tim](#12-tim)

---

## 1. Ringkasan Proyek

**JALA** adalah sistem *Cyber-Physical* yang mengubah tiang bus stop biasa di jalur MikroTrans (JakLingko) menjadi **sensor komunitas cerdas**.

Warga cukup **melambaikan tangan** di depan sensor — tanpa aplikasi, tanpa smartphone, tanpa memilih rute — dan sinyal fisik itu langsung diproses AI untuk dua tujuan utama:

1. **Membantu driver** mengetahui ada penumpang yang menunggu secara real-time (mengurangi kasus halte terlewat).
2. **Membantu pengelola armada** mengoptimalkan dispatch kendaraan berbasis prediksi AI dan data sensor langsung dari lapangan.

JALA bukan sekadar "IoT + ada AI-nya". JALA adalah implementasi nyata dari **siklus Cyber-Physical System** yang disebutkan sebagai pilar Revolusi Industri 4.0: sinyal fisik dari masyarakat → diproses AI → keputusan kembali ke dunia fisik (driver dan armada bergerak).

---

## 2. Latar Belakang & Masalah

**Fakta lapangan:** Lebih dari 60% warga Jakarta enggan beralih ke transportasi umum karena masalah aksesibilitas *first-mile* dan *last-mile*. [\[Greenpeace Indonesia, 2024\]](https://www.greenpeace.org/static/planet4-indonesia-stateless/2024/02/aca5c6c5-full-report_ind.pdf)

**Akar masalah:** Banyak rute feeder MikroTrans (JakLingko) melewati jalan lingkungan yang tidak memiliki halte fisik — hanya tiang rambu kecil. Hal ini memicu **ketidakpastian ganda**:

- Penumpang sering **terlewati** karena posisi menunggu tidak terlihat (terhalang pohon/kendaraan).
- Driver menyetir tanpa tahu ada penumpang yang menanti di depan.

**Mengapa ini masalah komunitas?** Dampaknya tidak merata — kelompok yang paling dirugikan adalah **lansia, anak sekolah, dan warga yang tidak memiliki smartphone atau kuota internet**. Mereka tidak bisa memesan via aplikasi, sehingga bergantung penuh pada sistem konvensional yang tidak andal.

JALA menyelesaikan masalah ini bukan dengan menambahkan aplikasi baru, melainkan dengan menjadikan **interaksi fisik paling sederhana (lambaian tangan) sebagai sumber data AI**.

---

## 3. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    DUNIA FISIK (Lapangan)                       │
│                                                                 │
│  👋 Warga melambaikan tangan di tiang halte                     │
│         ↓                                                       │
│  [IoT Node ESP32 + Sensor Gesture APDS-9960]                   │
│  → Validasi sinyal (anti-prank)                                │
│  → Kirim HTTP POST via WiFi                                     │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP POST /api/trigger
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND SERVER (Node.js/Express)               │
│                                                                 │
│  ┌──────────────┐  ┌─────────────────┐  ┌───────────────────┐  │
│  │ Status Halte │  │  Driver Records │  │  Absensi Records  │  │
│  │  (real-time) │  │  (GPS + status) │  │  (histori login)  │  │
│  └──────┬───────┘  └────────┬────────┘  └─────────┬─────────┘  │
│         └──────────────────┼────────────────────┘  │           │
│                            ↓                                    │
│  [AI Auto-Dispatch] [AI Query] [Rekomendasi] [Insight]         │
└─────────────────┬───────────────────────────────────────────────┘
                  │ HTTP (Flask API)
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│              AI MODEL SERVER (Python/Flask)                     │
│                                                                 │
│  RandomForestRegressor — model_jaklingko.joblib                 │
│  Input: hari (0-6), jam (5-22)                                  │
│  Output: estimasi_permintaan (0-15), level_kepadatan            │
│                                                                 │
│  Endpoint: /predict/now  /predict/heatmap  /predict?hari&jam   │
└─────────────────────────────────────────────────────────────────┘
                  │ HTTP + WebSocket polling
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│           FRONTEND React (Vite + TypeScript + Tailwind)         │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Dashboard Driver │  │ Dashboard        │  │ Halaman      │  │
│  │ (4-step flow)    │  │ Pengelola        │  │ Publik Warga │  │
│  │                  │  │ (AI Control      │  │ (Cek JALA)   │  │
│  │ + AI Route       │  │  Tower)          │  │              │  │
│  │   Suggestion     │  │                  │  │ + Status     │  │
│  └──────────────────┘  └──────────────────┘  │   real-time  │  │
│                                              │ + Prediksi AI│  │
│                                              └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Siklus Cyber-Physical yang didemonstrasikan:**
```
Sinyal Fisik → Data → AI → Keputusan → Aksi Fisik
(Lambaian)   (ESP32) (Model) (Dispatch) (Driver bergerak)
```

---

## 4. Komponen Hardware (IoT Node)

| No | Komponen | Spek/Tipe | Fungsi |
|----|----------|-----------|--------|
| 1 | Mikrokontroler | ESP32 WROOM 38Pin (USB, bukan Type-C) | Otak utama halte virtual; memproses sensor dan kirim data via WiFi |
| 2 | Sensor Gesture | APDS-9960 (I2C, addr 0x39) | Membaca lambaian tangan warga tanpa perlu menyentuh alat |
| 3 | Display Status | LCD 16x2 I2C (addr 0x27/0x3F) | Menampilkan status sistem (WiFi OK, Gesture terdeteksi, dll.) |
| 4 | Solar Panel | Polycrystalline 5V–6V (1W–2W) | Daya mandiri dari sinar matahari |
| 5 | Modul Charger | TP4056 + Protection | Mengatur pengisian baterai dari solar panel secara aman |
| 6 | Baterai | Lithium-Ion 18650 (min. 2200mAh) | Cadangan energi untuk operasi malam hari |
| 7 | Booster | MT3608 DC-DC (output 5V stabil) | Menaikkan tegangan baterai 3.7V ke 5V untuk ESP32 |

**Wiring I2C (SDA/SCL):** GPIO 21 / GPIO 22 — dipakai bersama oleh APDS-9960 dan LCD (alamat I2C berbeda, tidak konflik).

**Catatan teknis:** Brownout detector ESP32 dinonaktifkan via `WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0)` sebagai workaround sementara saat power supply kurang stabil. Untuk produksi, perlu ditambah kapasitor 470–1000µF di output booster.

**Library Arduino yang dibutuhkan:**
- `SparkFun_APDS9960` by SparkFun Electronics
- `LiquidCrystal_I2C` by Frank de Brabander
- `Adafruit_SSD1306` + `Adafruit_GFX` (opsional, untuk OLED)
- `WiFi.h`, `HTTPClient.h` (built-in Arduino-ESP32 core)

---

## 5. Komponen Software

### 5.1 Frontend — React Web App (Vite + TypeScript + Tailwind CSS)

**Dashboard Driver** — diakses driver dari HP/tablet di kendaraan:
- **AI Route Suggestion** — GPS aktif saat login, AI mendeteksi posisi driver dan menyarankan rute berdasarkan halte terdekat dari dataset resmi.
- **Step 1: Pilih Jurusan** — pilih kategori (ANGKUTAN UMUM INTEGRASI / MIKROTRANS / ANGKUTAN PENGUMPAN) dan rute.
- **Step 2: Assign Job** — melihat info rute lengkap, peta awal-akhir, tombol konfirmasi.
- **Step 3: Absensi** — verifikasi kehadiran via GPS (harus dalam radius 150m dari halte awal).
- **Step 4: Mulai Perjalanan** — full-screen map dengan live GPS driver, marker halte aktif + badge "Ada Penumpang" (update tiap 3 detik dari sensor IoT).

**Dashboard Pengelola — AI Control Tower** — diakses tim operasional Transjakarta/Dishub:
- **KPI Cards** — Driver Aktif, On-Time Rate, Alert Aktif, AI Accuracy, Rute Aktif.
- **AI Command Center** — AI "berbicara" dalam bahasa natural, bukan log terminal; menampilkan status sistem, rekomendasi, dan tombol Approve Dispatch.
- **AI Auto-Dispatch** — klik 1 tombol: AI membaca sinyal sensor + prediksi model, menghitung skor urgensi per halte, mencocokkan driver idle ke halte paling urgent, mengusulkan rencana penugasan. Pengelola konfirmasi sebelum dieksekusi.
- **Natural Language AI Query** — ketik pertanyaan bebas: "Rute mana yang paling sering terlambat?" / "Berapa driver aktif?" / "Kalau saya pindahkan 1 armada ke koridor padat, apa dampaknya?" — AI jawab dengan narasi + data pendukung.
- **AI Insight Panel** — kartu analisis naratif harian: prediksi keterlambatan per rute, jam sibuk berikutnya, passenger forecast, AI confidence score.
- **Live Fleet Map** — peta semua halte aktif dengan marker pulsing.
- **Heatmap Prediksi** — grid 7 hari × 18 jam, warna gradasi hijau–kuning–merah dari model AI.
- **Fleet Status** — Running / Idle / Emergency / Offline.
- **Manajemen Driver** — lihat status semua driver, assign rute manual.
- **Alert Center** — log insiden terbaru.

### 5.2 Backend — Node.js/Express

File: `server.js`  
Port: `3000`  
Persistensi: `jala_data.json` (file JSON lokal, otomatis load saat server start)

### 5.3 AI Model Server — Python/Flask

File: `model_api.py`  
Port: `5000`  
Model: `model_jaklingko.joblib` (RandomForestRegressor, scikit-learn)

---

## 6. Fitur AI & Penjelasan Teknis

### 6.1 Model Prediksi Demand (Core AI)

**Algoritma:** RandomForestRegressor (scikit-learn)  
**Dataset training:** Data jumlah penumpang harian MikroTrans/Transjakarta dari Satu Data Jakarta (6.078 baris, Feb 2024)  
**Fitur input:** `hari` (0=Senin, ..., 6=Minggu), `jam` (5–22)  
**Target output:** Estimasi jumlah permintaan penumpang (skala 0–15 per halte)

**Cara kerja:**
```python
model.predict([[0, 8]])   # Senin jam 08:00 → ~15 (TINGGI)
model.predict([[0, 14]])  # Senin jam 14:00 → ~3  (RENDAH)
```

**Endpoint yang disediakan:**
- `GET /predict/now` — prediksi otomatis pakai waktu saat ini
- `GET /predict?hari=0&jam=8` — prediksi spesifik
- `GET /predict/heatmap` — 126 kombinasi hari×jam sekaligus (untuk heatmap dashboard)

### 6.2 AI Auto-Dispatch (Decision AI)

Merupakan demonstrasi **siklus penuh Cyber-Physical System**:

```
LANGKAH 1: Baca status sensor seluruh halte JALA (real-time)
LANGKAH 2: Ambil prediksi kepadatan dari model AI
LANGKAH 3: Hitung Skor Urgensi per halte
           = Skor_Kesegaran(50%) + Skor_AI(50%)
           Skor_Kesegaran: makin baru triggernya, makin tinggi (0-100)
           Skor_AI: estimasi_permintaan × 5, max 100
LANGKAH 4: Cari driver idle dari pool
LANGKAH 5: Cocokkan driver idle → halte urgensi tertinggi
           → cari rute dari dataset yang melewati halte tersebut
LANGKAH 6: Kembalikan rencana + alasan ke pengelola (BUKAN auto-execute)
LANGKAH 7: Pengelola tekan "Konfirmasi" → rute di-assign ke driver
```

### 6.3 Natural Language AI Query

Menerima pertanyaan bebas dalam Bahasa Indonesia, memetakan ke intent kategori (delay/rute, driver, simulasi armada, prediksi, dll), menarik data real dari sistem, dan mengembalikan jawaban naratif disertai data pendukung terstruktur.

Contoh:
| Pertanyaan | Intent | Data yang ditarik |
|-----------|--------|------------------|
| "Rute mana yang paling sering terlambat?" | `delay` | halteAktif, histori absensi |
| "Berapa driver aktif sekarang?" | `driver` | driverRecords |
| "Kalau saya pindah 1 armada ke koridor padat?" | `simulasi` | prediksi AI + estimasi dampak |

### 6.4 AI Route Suggestion (Dashboard Driver)

Saat driver membuka Dashboard Driver, sistem:
1. Meminta izin GPS browser
2. Mengirim koordinat ke endpoint `/api/driver/suggest-rute`
3. Backend menghitung jarak ke semua halte (Haversine), menemukan halte terdekat
4. Mencocokkan nama halte ke dataset `v1.json` untuk menemukan rute yang berangkat dari sana
5. Mengembalikan pesan natural + confidence score

```
Jarak < 200m → "Anda berada di titik awal rute 14A. Mulai perjalanan?"
Jarak < 500m → "Anda kemungkinan akan menjalankan rute 14A dari Halte Juanda."
Jarak > 500m → "Anda berada 750m dari halte terdekat (Halte Juanda)."
```

### 6.5 Skor Urgensi Halte (AI Insight)

Penggabungan dua sumber data untuk menghasilkan skor 0–100:
- **60% dari prediksi model AI** (estimasi demand berbasis hari+jam)
- **40% dari aktivitas sensor real-time** (apakah ada trigger dalam 5 menit terakhir)

Halte dengan trigger sensor asli mendapat label **"LIVE"** di dashboard untuk membedakannya dari estimasi.

---

## 7. Responsible AI

JALA mengimplementasikan prinsip-prinsip AI yang bertanggung jawab secara eksplisit:

### 7.1 Human-in-the-Loop
AI Auto-Dispatch **tidak pernah mengeksekusi penugasan secara otomatis**. AI mengusulkan rencana lengkap dengan alasan, dan pengelola harus menekan tombol "Konfirmasi" secara eksplisit sebelum rute di-assign ke driver. Ini diterapkan di dua endpoint terpisah: `/api/auto-dispatch` (usulan) dan `/api/auto-dispatch/execute` (eksekusi).

### 7.2 Transparansi & Explainability
Setiap rekomendasi AI disertai:
- **Alasan** yang bisa dibaca manusia ("Halte ini memiliki skor urgensi tertinggi karena trigger sensor 2 menit lalu + prediksi AI TINGGI")
- **Confidence score** (%) di setiap output AI
- **Catatan metodologi** yang menjelaskan cara angka dihitung dan keterbatasannya

### 7.3 Keterbatasan Model yang Diakui Secara Terbuka
Model prediksi demand JALA saat ini:
- **Dilatih pada data agregat** se-Jakarta (bukan per-halte spesifik), sehingga prediksi berlaku untuk gambaran umum, bukan lokasi individual.
- **Hanya menggunakan 2 fitur** (hari + jam), belum mempertimbangkan faktor cuaca, hari libur nasional, atau event khusus.
- Keterbatasan ini ditampilkan secara eksplisit di UI ("estimasi berbasis pola umum, bukan data khusus halte ini") dan di komentar kode (`CATATAN (Responsible AI)`).

### 7.4 Anti-Prank & Validasi Fisik
Sensor APDS-9960 memerlukan deteksi **gesture yang stabil selama beberapa momen** sebelum trigger dikirim. Backend menerapkan **jeda anti-spam 5 detik** — trigger kedua dalam 5 detik pertama tidak dikirim ke server. Ini mengurangi risiko data palsu yang bisa merusak kualitas prediksi AI.

### 7.5 Desain Inklusif sebagai Inti
Desain "lambai tangan" bukan fitur tambahan — ini adalah keputusan desain **yang sengaja dibuat untuk kelompok yang sering terpinggirkan secara digital**: lansia, anak-anak, dan warga tanpa smartphone. AI hanya berfungsi optimal jika data masuknya inklusif.

---

## 8. Dataset yang Digunakan

| # | Dataset | Sumber | Digunakan untuk |
|---|---------|--------|----------------|
| 1 | Data Rute Transjakarta | [Satu Data Jakarta](https://satudata.jakarta.go.id/open-data/detail?kategori=dataset&page_url=data-rute-jalur-transjakarta&data_no=1) | Dropdown rute di Dashboard Driver, AI Auto-Dispatch matching |
| 2 | Data Halte Transjakarta | [Satu Data Jakarta](https://satudata.jakarta.go.id/open-data/detail?kategori=dataset&page_url=data-halte-transjakarta&data_no=1) | Peta marker halte, AI Route Suggestion, Cek JALA |
| 3 | Jumlah Bus Operasi & Penumpang | [Satu Data Jakarta](https://satudata.jakarta.go.id/open-data/detail?kategori=dataset&page_url=data-jumlah-bus-yang-beroperasi-dan-jumlah-penumpang-layanan-transjakarta&data_no=1) | Training model AI prediksi demand |
| 4 | Penumpang Angkutan Umum Harian | [Satu Data Jakarta](https://satudata.jakarta.go.id/open-data/detail?kategori=dataset&page_url=jumlah-penumpang-angkutan-umum-yang-terlayani-perhari&data_no=1) | Training model AI prediksi demand (`data_penumpang_harian.csv`) |

Semua dataset bersumber dari **data publik resmi Pemerintah Provinsi DKI Jakarta** melalui portal Satu Data Jakarta. Tidak ada data pribadi penumpang yang dikumpulkan atau diproses oleh sistem JALA.

---

## 9. Cara Menjalankan Sistem

### Prasyarat
- Node.js v18+
- Python 3.10+
- Arduino IDE 2.x
- ESP32 Dev Module + komponen hardware (lihat bagian 4)

### Step 1 — Clone & Setup Frontend

```bash
git clone <repo-url>
cd JALA
npm install
```

Buat file `.env` di root folder:
```env
VITE_API_URL=http://192.168.x.x:3000        # IP laptop yang jalankan server.js
VITE_MODEL_API_URL=http://192.168.x.x:5000  # IP laptop yang jalankan model_api.py
```

```bash
npm run dev
# Frontend jalan di http://localhost:5173
```

### Step 2 — Setup Backend (Node.js)

```bash
mkdir jala-backend && cd jala-backend
npm init -y
npm install express cors
# Copy server.js, data/halte.json, data/v1.json ke folder ini
node server.js
# Backend jalan di http://0.0.0.0:3000
```

### Step 3 — Setup AI Model Server (Python)

```bash
mkdir jala-model && cd jala-model
pip install flask joblib scikit-learn pandas
# Copy model_api.py dan model_jaklingko.joblib ke folder ini
python model_api.py
# Model server jalan di http://0.0.0.0:5000
```

### Step 4 — Flash ESP32

1. Buka `jala_gesture_to_server.ino` di Arduino IDE
2. Install library: `SparkFun_APDS9960`, `LiquidCrystal I2C` via Library Manager
3. Edit konfigurasi:
   ```cpp
   const char* WIFI_SSID     = "NAMA_WIFI_KAMU";
   const char* WIFI_PASSWORD = "PASSWORD_WIFI";
   const char* SERVER_URL    = "http://192.168.x.x:3000/api/trigger";
   const String ID_HALTE     = "JUANDA"; // nama halte sesuai dataset
   ```
4. Pilih board **ESP32 Dev Module**, upload

### Step 5 — Muat Data Demo (untuk presentasi)

Buka Dashboard Pengelola (`http://localhost:5173/pengelola`), klik tombol **"Muat Data Demo"** di pojok kanan atas. Sistem akan ter-populate dengan data simulasi yang realistis (driver, halte aktif, histori absensi).

### Verifikasi Sistem Berjalan

| Endpoint | Hasil yang Diharapkan |
|----------|-----------------------|
| `http://localhost:3000/api/status` | `{}` (kosong) atau status halte |
| `http://localhost:3000/api/driver/list` | `[]` atau list driver |
| `http://localhost:5000/predict/now` | JSON prediksi hari & jam saat ini |
| `http://localhost:5173` | Dashboard Driver |
| `http://localhost:5173/pengelola` | Dashboard Pengelola |
| `http://localhost:5173/cek` | Halaman Publik Warga |

---

## 10. Struktur Folder

```
JALA/ (Frontend React)
├── src/
│   ├── api/
│   │   ├── routeHalte.ts       # Type definitions halte & penumpang
│   │   ├── routemap.ts         # Helper fungsi peta & rute
│   │   ├── routeOps.ts         # API calls dashboard pengelola
│   │   ├── routePenumpang.ts   # Polling status sensor real-time
│   │   ├── routePrediksi.ts    # API calls model AI
│   │   ├── routeAbsensi.ts     # Absensi + verifikasi GPS
│   │   └── routeTask.ts        # Step flow dashboard driver
│   ├── components/feature/
│   │   ├── AIInsightPanel.tsx  # Kartu analisis naratif AI
│   │   ├── AIQueryBox.tsx      # Natural Language AI Query
│   │   ├── AIConfidenceCard.tsx
│   │   ├── AutoDispatchAI.tsx  # Fitur gong: AI Auto-Dispatch
│   │   ├── SaranRuteAI.tsx     # AI Route Suggestion (driver)
│   │   ├── KPICards.tsx
│   │   ├── LiveFleetMap.tsx
│   │   ├── HeatmapPrediksi.tsx
│   │   ├── FleetStatusPanel.tsx
│   │   ├── ManajemenDriver.tsx
│   │   ├── RekomendasiAksi.tsx
│   │   ├── AbsensiElem.tsx
│   │   └── MulaiPerjalananElem.tsx
│   ├── pages/
│   │   ├── Home.tsx            # Dashboard Driver
│   │   ├── DashboardPengelola.tsx
│   │   └── CekJala.tsx         # Halaman Publik Warga
│   └── data/
│       ├── halte.json          # Dataset halte (Satu Data Jakarta)
│       ├── v1.json             # Dataset rute Transjakarta & MikroTrans
│       └── penumpang.json      # Dataset penumpang per rute
│
jala-backend/ (Backend Node.js)
├── server.js                   # Express server + semua endpoint
├── jala_data.json              # Persistensi data (auto-generated)
└── data/
    ├── halte.json
    └── v1.json
│
jala-model/ (AI Model Server Python)
├── model_api.py                # Flask API server
├── model_jaklingko.joblib      # Model RandomForestRegressor
├── transjakarta.ipynb          # Notebook training model
└── data_penumpang_harian.csv   # Dataset training
│
jala-firmware/ (Firmware ESP32)
├── jala_gesture_to_server.ino  # Kode utama ESP32 (gesture + WiFi + LCD)
└── i2c_scanner.ino             # Utilitas: scan alamat I2C device
```

---

## 11. API Reference

### Backend (Port 3000)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/trigger` | ESP32 kirim trigger "ada penumpang" |
| `GET` | `/api/status` | Status semua halte (real-time) |
| `GET` | `/api/status/:id` | Status 1 halte spesifik |
| `POST` | `/api/absensi` | Catat absensi driver + verifikasi GPS |
| `GET` | `/api/absensi` | Histori absensi semua driver |
| `GET` | `/api/kpi` | Ringkasan KPI untuk dashboard |
| `GET` | `/api/fleet-status` | Jumlah running/idle/emergency/offline |
| `GET` | `/api/rekomendasi` | Rekomendasi aksi berbasis AI + sensor |
| `GET` | `/api/insight` | AI Insight: urgency score, proyeksi dampak |
| `POST` | `/api/driver/checkin` | Driver check-in / update status |
| `POST` | `/api/driver/assign` | Assign rute ke driver (manual) |
| `GET` | `/api/driver/list` | Daftar semua driver + status |
| `POST` | `/api/driver/suggest-rute` | AI sarankan rute dari koordinat GPS |
| `POST` | `/api/auto-dispatch` | Jalankan analisis AI Auto-Dispatch |
| `POST` | `/api/auto-dispatch/execute` | Eksekusi rencana dispatch (setelah konfirmasi) |
| `POST` | `/api/ai-query` | Natural Language AI Query |
| `POST` | `/api/chat` | Chatbot publik JALA Assistant |
| `POST` | `/api/demo/seed` | Isi data demo untuk presentasi |
| `POST` | `/api/demo/reset` | Reset semua data |

### AI Model Server (Port 5000)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/predict/now` | Prediksi untuk waktu saat ini |
| `GET` | `/predict?hari=0&jam=8` | Prediksi untuk hari & jam spesifik |
| `GET` | `/predict/heatmap` | 126 kombinasi hari×jam (untuk heatmap) |

---

## 12. Tim

**SMKN 1 Jakarta**  
KIR EROBO — Kecerdasan Artifisial  
LKS Dikmen 2026

---

*"JALA bukan hanya tentang teknologi. JALA adalah tentang memastikan setiap orang termasuk yang tidak melek teknologi — memiliki akses yang sama terhadap transportasi publik yang andal."*
