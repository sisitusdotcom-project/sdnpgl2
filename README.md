# Website Project Documentation — SDN Punggul 02

Dokumentasi resmi proyek website Sekolah Dasar Negeri (SDN) Punggul 02 berbasis standar Vanilla Web Architecture, Single Source of Truth (SSOT), dan arsitektur modular universal.

---

## 1. Informasi Proyek
- **Nama Proyek:** SDN Punggul 02
- **Jenis Website:** Website Pendidikan & Portal Resmi Sekolah Dasar Negeri
- **Tujuan Utama:** Pusat informasi akademik, publikasi kegiatan & prestasi, transparansi profil sekolah, serta sistem pendaftaran peserta didik baru (SPMB / PPDB).
- **Pemilik / Klien:** SDN Punggul 02 (Kecamatan Gedangan, Kabupaten Sidoarjo)
- **Target Pengguna:** Guru dan Tenaga Kependidikan (GTK), Siswa, Orang Tua/Wali Murid, Calon Siswa Baru, Pengawas Sekolah, dan Masyarakat Umum.
- **Status Proyek:** Implementasi Lengkap & Validasi Lulus (Production Ready)
- **Identitas Warna Utama:** Deep Academic Blue (`#14628a`) dengan aksen Emas Prestasi (`#f59e0b`) dan Teal Edukasi (`#2a9d8f`).
- **Lokasi & Kontak Sekolah:**
  - **Alamat:** Jl. Rajawali No. 51 Punggul, Kec. Gedangan, Kab. Sidoarjo, Jawa Timur
  - **WhatsApp / Kontak:** 085151983457
  - **Jam Layanan Sekolah:**
    - Senin – Kamis: 07.00 – 14.30 WIB
    - Jumat: 07.00 – 11.00 WIB
    - Sabtu: 07.00 – 10.00 WIB

---

## 2. Arsitektur & Teknologi

Proyek ini dibangun menggunakan standar web murni (*pure web standards*) tanpa framework runtime yang membebani kinerja:
- **HTML5:** Struktur semantik, aksesibel, dan ramah SEO.
- **CSS Vanilla (Modular Architecture):** Mengadopsi hierarki ITCSS terstruktur (`base/`, `components/`, `utilities/`, `pages/`) yang diorkestrasi via `main.css`.
- **JavaScript Vanilla:** Fungsionalitas modular tanpa dependensi runtime pihak ketiga (`layout.js`, `navigation.js`, modul per halaman).
- **Ikonografi:** Terstandarisasi menggunakan **Phosphor Icons** (`@phosphor-icons/web`).
- **Backend & Storage (Opsional):** Firebase Realtime Database (RTDB), Google Drive Storage, dan Google Apps Script (GAS) serverless bridge (lihat `BACKEND.md`).
- **Python (Automation & Quality Gate):** Skrip validasi mutu dan verifikasi kepatuhan standar (`tools/validate_project.py`).

---

## 3. Peta Dokumen Standar Proyek

Untuk efisiensi kerja agen dan developer, pedoman dibagi secara modular:

| Berkas | Fungsi Utama |
| :--- | :--- |
| **`AGENTS.md`** | **Pedoman Inti Operasional:** Aturan mutlak, SSOT/DRY, UI/UX, dan SOP perbaikan/refaktor. |
| **`STEPS.md`** | **Panduan Pembangunan Awal:** 5 Tahap langkah kerja membangun website baru dari nol. |
| **`BACKEND.md`** | **Integrasi Backend:** Panduan teknis Firebase RTDB, Google Drive, Google Apps Script, dan security rules untuk SDN Punggul 02. |
| **`DESAIN.md`** | **Sistem Visual:** Registri token CSS (warna utama `#14628a`, palet pendamping, tipografi, Bento Grid). |
| **`STRUKTUR.md`** | **Arsitektur Halaman:** Struktur folder, sitemap, matriks komponen SSOT, dan data katalog JSON SDN Punggul 02. |
| **`README.md`** | **Dokumentasi Umum:** Informasi profil proyek, petunjuk server lokal, quality gate, dan deployment. |

---

## 4. Menjalankan Server Lokal (Local Development)

Karena website ini menerapkan prinsip **SSOT Komponen Bersama** (`components/*.html`) dan **Pemisahan Data Dinamis** (`assets/data/*.json`) yang dimuat melalui Web API native `fetch()`, browser memerlukan protokol HTTP lokal (kebijakan keamanan browser memblokir `fetch()` jika dibuka via protokol `file:///`).

### Cara Cepat Menjalankan Server:
Buka terminal di folder root proyek dan jalankan perintah Python bawaan:

```bash
python -m http.server 8000
```

Buka peramban (browser) dan akses:
```text
http://localhost:8000
```

---

## 5. Validasi Mutu Otomatis (Quality Gate)

Sebelum melakukan deployment atau menyelesaikan tugas, jalankan skrip verifikasi otomatis bawaan proyek:

```bash
python tools/validate_project.py
```

Skrip ini akan memeriksa secara otomatis:
1. Validitas encoding UTF-8 di seluruh berkas proyek.
2. Keberadaan deklarasi wajib HTML5 (`<!DOCTYPE html>`, `<meta charset="UTF-8">`, viewport).
3. Ketiadaan kode *inline* CSS (`style="..."`) dan *inline* JavaScript (`onclick`, dsb).
4. Ketiadaan komentar dan baris kosong berlebih pada kode produksi (`.html`, `.css`, `.js`).
5. Ketiadaan parameter *cache busting* ilegal (`?v=`, timestamp).
6. Ketiadaan peretasan CSS usang seperti `-webkit-line-clamp`.
7. Integritas tautan dan aset internal (memastikan seluruh link `href` dan `src` tidak menghasilkan *broken links* 404).

---

## 6. SOP Pemeliharaan & Perbaikan Pasca-Pembangunan (Maintenance Guide)

Ikuti prosedur baku berikut saat melakukan perbaikan atau penambahan fitur:

### A. Memperbarui Komponen Bersama (Header, Navigasi, Footer, Sidebar)
- Komponen bersama berada di folder `components/` (`header.html`, `footer.html`, `sidebar.html`).
- **Aturan:** Cukup edit berkas terkait di folder `components/`. Seluruh halaman yang memanggil komponen tersebut akan otomatis menampilkan pembaruan tanpa perlu menyunting puluhan file HTML satu per satu.

### B. Mengubah Desain / Tema / Warna Global
- Buka berkas `assets/css/base/variables.css`.
- Sesuaikan token variabel CSS di `:root` (misal: `--color-primary: #14628a`, `--color-accent: #f59e0b`) atau di selector `html.dark-mode`.
- **Dilarang** mengganti warna secara lokal di file komponen jika perubahan tersebut berlaku global.

### C. Menambah atau Mengubah Data Berulang (GTK, Berita, Ekskul, Prestasi, FAQ)
- Data berulang disimpan terpisah di `assets/data/*.json`.
- Tambahkan atau perbarui objek data di berkas JSON terkait (`gtk.json`, `berita.json`, `ekstrakurikuler.json`, `prestasi.json`, `faq.json`).
- Tampilan card/grid akan otomatis terbentuk sesuai template generator di JavaScript. Hindari membuat card HTML manual.

### D. Menambahkan Halaman Baru
1. Buat folder baru dengan nama slug yang rapi (misal: `spmb/index.html`).
2. Gunakan kerangka dasar yang memanggil `main.css`, `layout.js`, dan placeholder SSOT (`<div id="app-header"></div>`, `<div id="app-footer"></div>`).
3. Buat file CSS/JS khusus halaman jika diperlukan di `assets/css/pages/` dan `assets/js/pages/`.
4. Daftarkan halaman baru pada berkas `STRUKTUR.md`.
5. Jalankan `python tools/validate_project.py` untuk memastikan seluruh path pemanggilan valid.

### E. Melakukan Bug Fixing (Rule of Least Blast Radius)
- Jika bug hanya terjadi pada satu tombol atau form di halaman tertentu, perbaiki secara lokal di CSS/JS spesifik halaman tersebut.
- Jangan mengubah file global (`main.css`, `layout.js`, atau `variables.css`) untuk menyelesaikan masalah spesifik yang bersifat lokal.
- Setelah perbaikan selesai, wajib lakukan uji regresi pada resolusi 320px dan jalankan skrip validasi.

---

## 7. Prosedur Deployment

Website berbasis MPA Vanilla ini bersifat statis dan dapat dideploy ke berbagai platform hosting modern:

### Opsi 1: Netlify / Vercel / Cloudflare Pages / GitHub Pages
- **Publish Directory:** `.` (root direktori proyek)
- **Build Command:** *(Kosongkan / tidak diperlukan)*

### Opsi 2: Web Hosting Konvensional (cPanel / Apache / Nginx)
- Unggah seluruh isi direktori proyek ke dalam folder `public_html/`.
- Pastikan server web mendukung pemuatan berkas `.webp`, `.json`, dan `.webmanifest`.

---

## 8. Catatan Pengembangan & Log Perubahan
- **Tahap 1:** Penyesuaian dokumen SSOT root (`README.md`, `DESAIN.md`, `STRUKTUR.md`, `BACKEND.md`, `STEPS.md`) untuk profil resmi SDN Punggul 02.
- **Identitas Warna:** Penerapan warna primer `#14628a` (Deep Academic Blue) dengan warna pendamping `#2a9d8f` (Teal Edukasi) dan aksen `#f59e0b` (Emas Prestasi).
