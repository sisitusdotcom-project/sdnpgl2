# Panduan Alur Kerja Pembangunan Website (Build Steps)

Dokumen ini merupakan panduan langkah demi langkah (*step-by-step execution roadmap*) bagi AI Agent dan developer saat membangun website baru dari awal.

Dokumen ini sengaja dipisahkan dari `AGENTS.md` agar proses eksekusi awal lebih terarah, terstruktur, dan tidak membebani konteks saat melakukan perawatan rutin di kemudian hari.

---

## Ringkasan 5 Tahap Pembangunan

```text
[Tahap 1: Analisis] ──> [Tahap 2: Perencanaan] ──> [Tahap 3: Implementasi] ──> [Tahap 4: Validasi] ──> [Tahap 5: Handoff]
```

---

## Tahap 1 — Analisis Kebutuhan & Identifikasi Entitas

Tujuan: Memahami secara mendalam profil brand, tujuan fungsional, dan target audiens sebelum menulis satu baris kode pun.

### Checklist Tindakan:
1. **Identifikasi Jenis Website:** Tentukan apakah website berupa profil bisnis, UMKM, institusi pendidikan, katalog layanan, portofolio kreatif, portal berita, atau aplikasi web terintegrasi.
2. **Eksplorasi Karakter Brand:** Baca dan diskusikan identitas visual pada `DESAIN.md` (warna brand, kepribadian, nada komunikasi, dan preferensi visual).
3. **Pemeriksaan Komponen yang Dibutuhkan:** Identifikasi kebutuhan navigasi (header, dropdown, drawer mobile, sticky footer, modal, dsb).
4. **Pemeriksaan Kebutuhan Data:** Identifikasi konten apa saja yang bersifat katalog atau berulang (produk, staf, layanan, agenda, testimoni, FAQ).
5. **Pemeriksaan Kebutuhan Backend:** Tentukan apakah website murni statis atau membutuhkan Firebase RTDB, Google Drive, atau Google Apps Script (lihat `BACKEND.md`).

---

## Tahap 2 — Perencanaan Arsitektur & Registri Token (SSOT Setup)

Tujuan: Menyiapkan sumber kebenaran tunggal (*Single Source of Truth*) untuk desain, komponen, dan struktur data sebelum membuat halaman HTML.

### Checklist Tindakan:
1. **Registri Design Tokens (`assets/css/base/variables.css`):**
   - Tetapkan warna primer, sekunder, aksen, background, dan teks di `:root`.
   - Tetapkan konfigurasi mode gelap di `html.dark-mode`.
   - Tetapkan skala spacing (`--space-xs` s/d `--space-3xl`) dan border-radius.
2. **Penyusunan Sitemap di `STRUKTUR.md`:**
   - Daftarkan seluruh rute URL halaman dengan format kebab-case bersih.
   - Isi matriks komponen bersama (Header, Footer, Sidebar).
   - Isi matriks data dinamis (JSON katalog yang perlu disiapkan di `assets/data/`).
3. **Penyiapan Komponen Layout Bersama (`components/`):**
   - Buat `components/header.html` (logo, menu navigasi, tombol aksi, Phosphor Icons).
   - Buat `components/footer.html` (kontak, copyright, sosial media, sitemap).
   - Buat `components/sidebar.html` (jika halaman artikel/detail memerlukan widget samping).

---

## Tahap 3 — Implementasi Kode Modular

Tujuan: Mengembangkan halaman website dengan struktur bersih, modular, dan sepenuhnya mematuhi prinsip SSOT & DRY.

### Checklist Tindakan:
1. **Fondasi CSS Modular:**
   - Pastikan `assets/css/base/reset.css` memuat:
     ```css
     *, *::before, *::after {
       box-sizing: border-box;
       -webkit-tap-highlight-color: transparent;
     }
     body {
       -webkit-font-smoothing: antialiased;
       -moz-osx-font-smoothing: grayscale;
       text-rendering: optimizeLegibility;
     }
     ```
   - Susun styling komponen terisolasi di `assets/css/components/` (`nav.css`, `card.css`, `button.css`, `footer.css`, `modal.css`).
   - Hubungkan seluruh berkas CSS melalui `assets/css/main.css`.
2. **Fondasi JavaScript Modular:**
   - Siapkan `assets/js/base/layout.js` yang bertugas memuat komponen bersama (`header.html`, `footer.html`) secara asynchronous via `fetch()` ke placeholder `<div id="app-header"></div>` dan `<div id="app-footer"></div>`.
   - Siapkan `assets/js/components/navigation.js` untuk interaksi hamburger drawer mobile dan dropdown.
3. **Penyusunan Konten Data Dinamis:**
   - Buat berkas data di `assets/data/*.json`.
   - Tulis skrip perender di `assets/js/pages/*.js` menggunakan template literal untuk menghasilkan card secara dinamis.
4. **Penerapan Standar UI/UX Unggulan:**
   - Pastikan seluruh tombol/link memiliki touch target $\ge 44 \times 44\text{px}$.
   - Dilarang keras memakai `-webkit-line-clamp`. Terapkan card flex column dengan `margin-top: auto` pada tombol CTA.
   - Berikan `min-width: 0;` pada direct children CSS Grid dan Flexbox untuk mencegah grid blowout.
   - Gunakan ikon resmi Phosphor Icons:
     ```html
     <script src="https://unpkg.com/@phosphor-icons/web"></script>
     <i class="ph ph-envelope"></i>
     <i class="ph-bold ph-phone"></i>
     ```

---

## Tahap 4 — Pengujian dan Validasi Mutu Otomatis (Quality Gate)

Tujuan: Menjamin tidak ada broken link, kesalahan encoding, kode inline, atau peretasan CSS usang sebelum situs diserahkan.

### Checklist Tindakan:
1. **Jalankan Audit Otomatis:**
   ```bash
   python tools/validate_project.py
   ```
   Pastikan berstatus **LULUS** (0 Errors). Jika ada error, perbaiki sumber masalahnya segera.
2. **Uji Responsivitas Lintas Viewport:**
   - Resolusi Small Mobile: 320px (iPhone SE, Android compact).
   - Resolusi Mobile Standard: 375px – 414px.
   - Resolusi Tablet: 768px.
   - Resolusi Desktop: 1280px+.
3. **Uji Interaksi & Navigasi:**
   - Buka dan tutup hamburger drawer di mobile.
   - Uji seluruh link internal dan eksternal.
   - Uji form input, fokus keyboard (`Tab`, `Enter`), dan modal dialog.
   - Periksa tab Console di Developer Tools untuk memastikan 0 error JavaScript.

---

## Tahap 5 — Dokumentasi & Serah Terima (Handoff)

Tujuan: Memastikan dokumentasi proyek selalu terbaharui dan mudah dipelihara oleh pengembang atau agen berikutnya.

### Checklist Tindakan:
1. **Perbarui `STRUKTUR.md`:** Tandai seluruh halaman yang selesai dengan status `Completed`.
2. **Perbarui `README.md`:** Lengkapi deskripsi proyek, teknologi yang terpasang, dan log rilis awal.
3. **Dokumentasikan Konfigurasi Backend (jika ada):** Catat petunjuk pengisian API Key dan konfigurasi database di `BACKEND.md`.
