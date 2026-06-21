# JALA (JakLingko Auto-Locate Assistant) - Smart E-Halte
> **Sistem Halte Virtual Berbasis IoT Tenaga Surya dan Geofencing Multi-Rute MikroTrans Terintegrasi Machine Learning Regressor**

Proyek ini dirancang sebagai solusi integrasi transportasi publik pintar (*Smart City*) untuk memecahkan masalah aksesibilitas *first-mile* dan *last-mile* angkutan MikroTrans (JakLingko) di DKI Jakarta. Dengan teknologi *Touchless Gesture Sensor* berbasis IoT di lapangan dan aplikasi navigasi *Geofencing* untuk supir, **JALA-Transit** menjamin tidak ada lagi penumpang yang terlewat di titik *Bus Stop* non-halte.

---

## Panduan Git & Alur Berkontribusi (Git Workflow)

Untuk menjaga stabilitas kode utama, repositori ini dibagi menjadi dua *branch* utama:
1. **`main`**: Branch produksi dan final. Hanya boleh di-merge oleh Lead (Ketua Tim). **Dilarang keras melakukan push langsung ke branch ini.**
2. **`web`**: Branch khusus untuk tim developer web (Adik Kelas). Semua progres koding Next.js, UI, dan integrasi MQTT dikerjakan dan di-push ke branch ini.

### Cara Kerja untuk Tim Web:
Sebelum mulai koding, pastikan Anda berada di branch `web` yang benar:

```bash
# 1. Clone repositori (jika belum)
git clone <url-repo-jala-transit>
cd jala-transit-project

# 2. Pindah ke branch web
git checkout web

# 3. Pastikan kode Anda sinkron dengan server sebelum koding
git pull origin web

# 4. Setelah selesai koding, commit dan push ke branch web
git add .
git commit -m "feat: menambah peta navigasi supir"
git push origin web