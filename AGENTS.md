# Website Development Standards & AI Agent Instructions

Dokumen ini merupakan pedoman operasional utama bagi seluruh AI Agent dan developer.

Pedoman ini menjadi rujukan wajib dalam **setiap siklus kerja**: baik saat pembangunan awal, penambahan fitur, refaktor kode, maupun perbaikan bug (*bug fixing*).

---

## 1. Batasan Teknologi & Aturan Mutlak

Gunakan teknologi standar web native:
- **HTML5** untuk struktur semantik.
- **CSS Vanilla** untuk seluruh styling.
- **JavaScript Vanilla** untuk interaktivitas dan manipulasi DOM.
- **Python** untuk otomatisasi, manipulasi berkas teks, validasi, dan skrip pendukung.

### Larangan Mutlak:
1. **Dilarang Framework:** Jangan gunakan Tailwind, Bootstrap, React, Vue, jQuery, dsb.
2. **Dilarang Inline Code:** Dilarang `style="..."`, inline event handler (`onclick=`, dsb), tag `<style>`, atau tag `<script>` tanpa `src`.
3. **Dilarang Komentar & Baris Kosong:** Seluruh file HTML, CSS, dan JS wajib bersih sepenuhnya dari komentar dan baris kosong yang tidak fungsional.
4. **Dilarang Cache Busting:** Dilarang menambahkan query parameter versi atau timestamp (`?v=1.0`, dsb).
5. **Dilarang Manipulasi File via PowerShell:** Gunakan Python dengan `encoding="utf-8"` secara eksplisit untuk membaca, menulis, atau mengganti teks pada berkas.
6. **Dilarang `-webkit-line-clamp`:** Jangan gunakan `-webkit-line-clamp` atau `display: -webkit-box`. Gunakan tata letak flex/grid dengan tinggi alami atau batasi ringkasan teks dari sumber data.
7. **Dilarang `prefers-reduced-motion`:** Dilarang menggunakan `@media (prefers-reduced-motion)` atau mematikan animasi secara paksa. Aturan ini terbukti mematikan transisi, efek slider, dan animasi visual di HP/browser saat mode hemat baterai aktif. Seluruh animasi harus tetap hidup, halus, dan menyenangkan.

---

## 2. Standar Ikon: Phosphor Icons

Seluruh ikon antarmuka wajib distandarisasi menggunakan **Phosphor Icons**:
* Panggil pustaka ikon pada `<head>` setiap halaman:
  ```html
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  ```
* Gunakan kelas semantik Phosphor Icons:
  * Regular: `<i class="ph ph-envelope"></i>`
  * Bold: `<i class="ph-bold ph-phone"></i>`
  * Fill: `<i class="ph-fill ph-check-circle"></i>`
* Standarisasi ukuran ikon menggunakan CSS: `font-size: 1rem (16px)`, `1.25rem (20px)`, atau `1.5rem (24px)`.

---

## 3. Prinsip Wajib SSOT dan DRY

Setiap struktur kode, aset visual, dan data wajib memiliki satu sumber kebenaran tunggal (*Single Source of Truth*):

1. **SSOT Desain (Tokens):** Seluruh nilai warna heksadesimal, font, spacing, dan radius wajib didefinisikan satu kali di `:root` pada `assets/css/base/variables.css`. Dilarang menuliskan kode warna langsung berulang di file komponen.
2. **SSOT Komponen Bersama:** Header, Navbar, Footer, dan Sidebar wajib dibuat terisolasi di folder `components/` (`header.html`, `footer.html`, dll) dan dimuat dinamis melalui `layout.js` ke placeholder `<div id="app-header"></div>` dan `<div id="app-footer"></div>`. Dilarang menduplikasi markup layout ke puluhan file HTML.
3. **SSOT Data Berulang:** Data katalog produk, layanan, profil staf, agenda, testimoni, atau FAQ wajib dipisahkan ke `assets/data/*.json` dan dirender dinamis via JavaScript template literal.
4. **Prinsip DRY:** Fungsi pembantu bersama (format tanggal, angka rupiah, handler modal, toast) wajib berada di modul helper terpusat di `assets/js/base/` atau `assets/js/components/`.

---

## 4. Standar Keunggulan UI/UX & Detail Interaksi

1. **Hilangkan Tap Highlight Kasar:**
   Wajib terapkan pada reset global di `assets/css/base/reset.css`:
   ```css
   *, *::before, *::after {
     -webkit-tap-highlight-color: transparent;
   }
   ```
2. **Font Rendering Halus:**
   ```css
   body {
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
     text-rendering: optimizeLegibility;
   }
   ```
3. **Touch Target Mobile $\ge$ 44x44px:** Seluruh elemen interaktif (tombol, link, ikon menu) wajib memiliki area sentuh minimal $44 \times 44\text{px}$.
4. **Kesejajaran Tombol Card (Flex Column Pattern):**
   ```css
   .card-item {
     display: flex;
     flex-direction: column;
   }
   .card-item .card-btn {
     margin-top: auto;
   }
   ```
5. **Micro-Interactions & Aksesibilitas:**
   - Transisi halus: `transition: background-color 0.2s ease, transform 0.15s ease;`
   - Efek tekan: `button:active { transform: scale(0.98); }`
   - Garis fokus keyboard wajib: `:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }`

---

## 5. Pencegahan CSS Grid Blowout & Horizontal Overflow

1. **Child Shrink Protection:** Direct children dari CSS Grid dan Flexbox wajib memiliki `min-width: 0;`:
   ```css
   .grid-layout > *, .flex-layout > * {
     min-width: 0;
   }
   ```
2. **Fluid Media:** `img, video, iframe, svg { max-width: 100%; height: auto; }`
3. **Teks Panjang:** Gunakan `overflow-wrap: break-word;` pada elemen artikel/body.
4. **Dilarang Semu:** Jangan gunakan `overflow-x: hidden;` pada tag `body` untuk menutupi kesalahan layout. Perbaiki elemen penyebabnya.

---

## 6. SOP Perawatan, Perbaikan, dan Anti-Regresi (Maintenance Playbook)

Saat melakukan perbaikan bug, refaktor, atau modifikasi pada website yang sudah berjalan:

### A. Aturan Dampak Terkecil (*Rule of Least Blast Radius*)
- Identifikasi apakah masalah bersifat **lokal** (hanya di 1 halaman) atau **global** (pada komponen bersama atau token desain).
- Jika bug hanya terjadi pada form halaman kontak, **dilarang mengubah berkas CSS/JS global**. Buat atau perbaiki aturan di `assets/css/pages/kontak.css` atau `assets/js/pages/kontak.js`.
- Sebaliknya, jika ada ketidakkonsistenan warna tema atau navigasi, perbaiki pada berkas SSOT (`variables.css` atau `components/header.html`), jangan menambal dengan override lokal di file HTML masing-masing.

### B. Checklist Verifikasi Anti-Regresi Pasca-Perbaikan:
- [ ] Tampilan responsif pada resolusi 320px, 375px, 768px, dan 1280px+.
- [ ] Navigasi mobile (hamburger drawer) dapat dibuka dan ditutup dengan mulus.
- [ ] Tidak ada teks terpotong atau memicu horizontal scrollbar.
- [ ] Tab Console developer tools bebas dari pesan error.
- [ ] Jalankan audit otomatis: `python tools/validate_project.py` dan pastikan berstatus **LULUS**.

---

## 7. Peta Navigasi Dokumen Proyek

Gunakan dokumen pendukung sesuai kebutuhan spesifik:

| Dokumen | Tujuan & Kapan Digunakan |
| :--- | :--- |
| **STEPS.md** | **Alur Pembangunan Awal:** Panduan 5 tahap kerja membangun website dari nol. |
| **BACKEND.md** | **Integrasi Backend:** Standar Firebase RTDB, Google Drive storage, dan Google Apps Script (GAS). |
| **DESAIN.md** | **Sistem Visual:** Registri token variabel CSS, tipografi, breakpoint, dan tata letak Bento Grid. |
| **STRUKTUR.md** | **Arsitektur Halaman:** Struktur folder, sitemap, matriks komponen bersama, dan data dinamis. |
| **README.md** | **Informasi Umum & Server:** Petunjuk local dev server (`python -m http.server 8000`) dan deployment. |

---

**PRINSIP UTAMA: Selalu bertindak dengan dampak terkecil (*least blast radius*), patuhi SSOT & DRY, dan hadirkan UI/UX terbaik tanpa peretasan kode usang.**
