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


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
