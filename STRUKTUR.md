# Website Architecture & Page Planning — SDN Punggul 02

Dokumen ini berisi rancangan arsitektur direktori, sitemap, matriks komponen SSOT, dan perencanaan setiap halaman website **SDN Punggul 02** sebelum dan selama implementasi.

---

## 1. Gambaran Umum Proyek
- **Nama Proyek:** SDN Punggul 02
- **Jenis Website:** Sekolah & Edukasi (Sekolah Dasar Negeri)
- **Tujuan Utama Website:** Pusat informasi resmi sekolah, publikasi kegiatan & prestasi, transparansi profil pendidik & tenaga kependidikan (GTK), sarana pembelajaran & literasi, serta layanan informasi penerimaan peserta didik baru (SPMB / PPDB).
- **Target Audiens:** Orang tua/wali murid, calon siswa & wali murid pendaftar SPMB, peserta didik, guru dan staf kependidikan, serta dinas pendidikan dan masyarakat umum.
- **Standar Arsitektur:** Multi-Page Architecture (MPA) berbasis Vanilla Web Standards & SSOT Modular.

---

## 2. Struktur Direktori Standar Baku (Universal Modular Architecture)

Website SDN Punggul 02 mengikuti hierarki direktori teruji berikut untuk menjaga pemisahan tanggung jawab (*separation of concerns*) dan kemudahan pemeliharaan:

```text
d:\project/
├── index.html                   # Beranda utama (Sambutan, Bento Statistik, Berita, Galeri)
├── components/                  # SSOT Komponen Layout Bersama (HTML Partial)
│   ├── header.html              # Topbar info, logo SDN Punggul 02, menu Phosphor Icons, CTA SPMB
│   ├── footer.html              # Alamat Gedangan-Sidoarjo, WA 085151983457, jam layanan, tautan
│   ├── sidebar.html             # Widget info berita terbaru, pengumuman SPMB, link cepat
│   └── hero.html                # Banner selamat datang, slogan, dan CTA utama
├── profil/                      # Subhalaman Profil Sekolah
│   └── index.html               # Sejarah, Visi-Misi, Struktur GTK, dan Sarana Prasarana
├── akademik/                    # Subhalaman Akademik & Kesiswaan
│   └── index.html               # Kurikulum Merdeka, Pembiasaan Karakter, Ekstrakurikuler
├── berita/                      # Subhalaman Warta & Agenda
│   └── index.html               # Kabar Sekolah, Pengumuman Resmi, Prestasi
├── spmb/                        # Subhalaman Penerimaan Murid Baru
│   └── index.html               # Alur Pendaftaran, Syarat PPDB/SPMB, Jadwal, FAQ
├── galeri/                      # Subhalaman Dokumentasi
│   └── index.html               # Galeri Foto Kegiatan Belajar Mengajar, Lomba, Ekskul
├── kontak/                      # Subhalaman Kontak & Lokasi
│   └── index.html               # Peta Lokasi Jl. Rajawali No. 51 Punggul, Form Pesan, WA Chat
├── assets/
│   ├── css/
│   │   ├── main.css             # Entry point CSS (@import seluruh sub-modul)
│   │   ├── base/                # Fondasi styling
│   │   │   ├── reset.css        # Box-sizing, tap-highlight-color transparent
│   │   │   ├── variables.css    # SSOT Design Tokens (Warna #14628a, Font, Spacing, Radius)
│   │   │   └── typography.css   # Aturan teks dasar dan heading
│   │   ├── components/          # Styling komponen modular bersama
│   │   │   ├── nav.css          # Navigasi desktop & drawer mobile
│   │   │   ├── button.css       # Tombol primer (#14628a), aksen (#f59e0b), dan outline
│   │   │   ├── card.css         # Card flex-column dengan tombol rata bawah
│   │   │   ├── hero.css         # Hero banner beranda
│   │   │   ├── sidebar.css      # Sidebar artikel dan pengumuman
│   │   │   ├── footer.css       # Footer 4 kolom responsif
│   │   │   └── modal.css        # Dialog modal detail berita/gambar
│   │   ├── utilities/           # Kelas bantuan umum
│   │   │   ├── layout.css       # Wrapper container, bento-grid, flex/grid helpers
│   │   │   ├── helpers.css      # Text-align, utility display
│   │   │   └── animations.css   # Fade-in, transform scale halus
│   │   └── pages/               # Styling khusus halaman tertentu
│   │       ├── home.css         # Layout bento dan section beranda
│   │       ├── profil.css       # Layout timeline sejarah & grid GTK
│   │       ├── akademik.css     # Tab kurikulum & grid ekskul
│   │       ├── berita.css       # Filter kategori warta & kartu artikel
│   │       ├── spmb.css         # Timeline alur pendaftaran & accordion syarat
│   │       ├── galeri.css       # Masonry grid foto kegiatan
│   │       └── kontak.css       # Dua kolom form & peta Google Maps
│   ├── js/
│   │   ├── main.js              # Inisialisasi utama
│   │   ├── base/                # Inti tata letak
│   │   │   ├── layout.js        # Loader komponen bersama via fetch(), dark mode toggle
│   │   │   ├── firebase-config.js # Konfigurasi client RTDB (jika integrasi form backend)
│   │   │   └── drive-utils.js   # Helper streaming URL Google Drive
│   │   ├── components/          # Interaktivitas komponen
│   │   │   ├── navigation.js    # Hamburger drawer, active link detector
│   │   │   └── modal.js         # Dialog lightbox galeri & preview detail
│   │   └── pages/               # Logika fungsional dinamis per halaman
│   │       ├── home.js          # Fetch ringkasan berita, statistik bento
│   │       ├── profil.js        # Render data GTK & sarana prasarana
│   │       ├── akademik.js      # Render data ekstrakurikuler & prestasi
│   │       ├── berita.js        # Render daftar berita & filter pencarian
│   │       ├── spmb.js          # Accordion FAQ & kalkulator zonasi/alur
│   │       ├── galeri.js        # Filter kategori foto & modal viewer
│   │       └── kontak.js        # Validasi form aspirasi/kontak
│   ├── data/                    # SSOT Berkas Data Dinamis (JSON)
│   │   ├── berita.json          # Data artikel, berita, dan pengumuman sekolah
│   │   ├── gtk.json             # Data guru, wali kelas, dan staf kependidikan
│   │   ├── ekstrakurikuler.json # Data kegiatan ekskul (Pramuka, Tari, Drumband, dll)
│   │   ├── prestasi.json        # Data kejuaraan dan pencapaian murid
│   │   ├── fasilitas.json       # Data sarana dan prasarana sekolah
│   │   └── faq.json             # Pertanyaan umum seputar sekolah & SPMB
│   ├── img/                     # Aset gambar format WebP
│   │   ├── banner/              # Banner hero dan header halaman
│   │   ├── logo/                # Logo SDN Punggul 02 (`tiny-logo.webp`)
│   │   ├── favicon/             # Paket favicon lengkap
│   │   └── konten/              # Foto GTK, kegiatan belajar, sarana
│   └── icons/                   # Phosphor Icons (via CDN unpkg)
├── tools/                       # Skrip otomatisasi & verifikasi mutu Python
│   ├── convert_webp.py          # Skrip konversi batch JPG/PNG ke WebP
│   └── validate_project.py      # Quality gate audit standar proyek
├── AGENTS.md                    # Pedoman operasional utama (Build & Maintenance)
├── STEPS.md                     # Panduan roadmap 5 tahap pembangunan awal
├── BACKEND.md                   # Standar Firebase RTDB, Google Drive, & GAS
├── DESAIN.md                    # Sistem desain visual, tokens warna #14628a
├── STRUKTUR.md                  # Arsitektur halaman, sitemap, matriks SSOT
└── README.md                    # Dokumentasi umum proyek & server lokal
```

---

## 3. Matriks Komponen Bersama & SSOT

Komponen bersama dibuat terpusat di `components/` dan dimuat otomatis melalui `layout.js`:

| Nama Komponen | Lokasi Berkas (SSOT) | Target Placeholder di HTML | Digunakan Oleh Halaman | Fungsi Utama |
| :--- | :--- | :--- | :--- | :--- |
| **Header & Nav** | `components/header.html` | `<div id="app-header"></div>` | Seluruh Halaman | Identitas logo SDN Punggul 02, menu navigasi, tombol CTA SPMB, toggle tema gelap/terang. |
| **Footer** | `components/footer.html` | `<div id="app-footer"></div>` | Seluruh Halaman | Alamat Jl. Rajawali No. 51 Punggul Gedangan, WA 085151983457, jam layanan, copyright, tautan cepat. |
| **Sidebar** | `components/sidebar.html` | `<div id="app-sidebar"></div>` | Berita & Pengumuman | Widget pencarian warta, tautan pengumuman SPMB, agenda terdekat, kontak darurat. |
| **Hero Banner** | `components/hero.html` | `<div id="app-hero"></div>` | Beranda (`index.html`) | Headline selamat datang, slogan keunggulan Profil Pelajar Pancasila, dan tombol aksi utama. |

---

## 4. Matriks Data Berulang (Data-Driven SSOT)

Untuk mencegah duplikasi markup HTML dan memudahkan pembaruan berkala oleh pengelola sekolah:

| Domain Data | Berkas SSOT Data | Skrip Perender (JS) | Elemen Container Target | Tujuan & Manfaat Perawatan |
| :--- | :--- | :--- | :--- | :--- |
| **Berita & Pengumuman** | `assets/data/berita.json` | `assets/js/pages/berita.js` | `<div class="berita-grid"></div>` | Menambah warta kegiatan atau pengumuman libur/ujian tanpa merombak file HTML. |
| **Guru & Staf (GTK)** | `assets/data/gtk.json` | `assets/js/pages/profil.js` | `<div class="gtk-grid"></div>` | Memperbarui daftar pendidik, wali kelas, dan tenaga kependidikan secara terpusat di JSON. |
| **Ekstrakurikuler** | `assets/data/ekstrakurikuler.json` | `assets/js/pages/akademik.js` | `<div class="ekskul-grid"></div>` | Mengelola daftar ekskul (Pramuka, Drumband, Tari, Silat, dsb), jadwal, dan pembina. |
| **Prestasi Siswa** | `assets/data/prestasi.json` | `assets/js/pages/akademik.js` | `<div class="prestasi-grid"></div>` | Mempublikasikan riwayat juara dan piagam prestasi siswa secara berkala. |
| **Sarana & Prasarana** | `assets/data/fasilitas.json` | `assets/js/pages/profil.js` | `<div class="fasilitas-grid"></div>` | Menampilkan dokumentasi ruang kelas, laboratorium, perpustakaan, dan area olahraga. |
| **FAQ SPMB / PPDB** | `assets/data/faq.json` | `assets/js/pages/spmb.js` | `<div class="faq-accordion"></div>` | Mengupdate tanya jawab seputar syarat usia masuk SD, zonasi, dan berkas pendaftaran. |

---

## 5. Sitemap & Hirarki Navigasi

Hirarki URL bersih berbasis folder kebab-case:

- `/index.html` — Beranda (Homepage): Sambutan Kepala Sekolah, Bento Statistik, Keunggulan, Berita Terkini, Galeri Cuplikan, Info Kontak Ringkas.
- `/profil/index.html` — Profil Sekolah: Sejarah Berdirinya Sekolah, Visi & Misi, Nilai Karakter, Struktur Organisasi, Daftar GTK, Sarana Prasarana.
- `/akademik/index.html` — Akademik & Kesiswaan: Kurikulum Merdeka, Program Pembiasaan Karakter, Daftar Ekstrakurikuler, Kalender Akademik.
- `/berita/index.html` — Warta & Agenda: Berita Kegiatan Belajar Mengajar, Pengumuman Resmi Dinas/Sekolah, Dokumentasi Prestasi.
- `/spmb/index.html` — Penerimaan Murid Baru (SPMB / PPDB): Alur Pendaftaran, Syarat & Ketentuan Usia Masuk, Jadwal Pelaksanaan, Kontak Helpdesk, Formulir.
- `/galeri/index.html` — Dokumentasi Kegiatan: Foto & Video Kegiatan Belajar, Lomba, Upacara, dan Ekstrakurikuler.
- `/kontak/index.html` — Kontak & Layanan: Alamat Lengkap Jl. Rajawali No. 51 Punggul Gedangan, Peta Google Maps Interaktif, No WhatsApp, Jam Kerja, Form Aspirasi.

---

## 6. Rencana Spesifikasi Setiap Halaman

### Halaman 1: Beranda (`index.html`)
- **CSS Khusus:** `assets/css/pages/home.css`
- **JS Khusus:** `assets/js/pages/home.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Hero (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** `berita.json` (3 berita terbaru), `prestasi.json` (sorotan kejuaraan).
- **Section Layout (Atas ke Bawah):**
  1. Section Hero Banner (Slogan resmi, ajakan kenal sekolah, tombol info SPMB & Profil).
  2. Section Bento Grid Keunggulan & Statistik (Jumlah Siswa, GTK, Akreditasi A, Kurikulum Merdeka).
  3. Section Sambutan Kepala Sekolah SDN Punggul 02.
  4. Section Warta & Agenda Terkini (3 Berita terbaru dengan link ke arsip berita).
  5. Section Cuplikan Galeri Kegiatan (Grid foto WebP dokumentasi kegiatan).
  6. Section Quick Contact & Jam Operasional Sekolah.

### Halaman 2: Profil Sekolah (`profil/index.html`)
- **CSS Khusus:** `assets/css/pages/profil.css`
- **JS Khusus:** `assets/js/pages/profil.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** `gtk.json`, `fasilitas.json`.
- **Section Layout:** Hero Header Profil, Sejarah Singkat SDN Punggul 02, Visi & Misi & Tujuan Sekolah, Struktur Organisasi, Direktori Pendidik & Tenaga Kependidikan, Galeri Sarana Prasarana.

### Halaman 3: Akademik & Kesiswaan (`akademik/index.html`)
- **CSS Khusus:** `assets/css/pages/akademik.css`
- **JS Khusus:** `assets/js/pages/akademik.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** `ekstrakurikuler.json`, `prestasi.json`.
- **Section Layout:** Hero Header Akademik, Implementasi Kurikulum Merdeka & P5, Program Pembiasaan Karakter (Literasi, Sholat Berjamaah, Senam Sehat, Adiwiyata), Ragam Ekstrakurikuler, Panggung Prestasi Siswa.

### Halaman 4: Warta & Pengumuman (`berita/index.html`)
- **CSS Khusus:** `assets/css/pages/berita.css`
- **JS Khusus:** `assets/js/pages/berita.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Ya`).
- **Data SSOT Dimuat:** `berita.json`.
- **Section Layout:** Header Berita, Filter Kategori (Semua, Berita Sekolah, Pengumuman, Prestasi), Grid Kartu Warta, Sidebar (Pencarian, Pengumuman Penting, Link Cepat).

### Halaman 5: SPMB / PPDB (`spmb/index.html`)
- **CSS Khusus:** `assets/css/pages/spmb.css`
- **JS Khusus:** `assets/js/pages/spmb.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** `faq.json`.
- **Section Layout:** Hero Banner SPMB Tahun Ajaran Baru, Timeline Jadwal Pelaksanaan, Diagram Alur Pendaftaran, Syarat & Ketentuan Masuk SD Negeri, Accordion FAQ Pendaftaran, Kontak Layanan Panitia SPMB (WhatsApp).

### Halaman 6: Galeri Dokumentasi (`galeri/index.html`)
- **CSS Khusus:** `assets/css/pages/galeri.css`
- **JS Khusus:** `assets/js/pages/galeri.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** `assets/data/galeri.json` (atau direktori WebP lokal).
- **Section Layout:** Header Galeri, Filter Kategori (Pembelajaran, Upacara, Ekskul, Lomba), Masonry Grid Foto WebP, Modal Lightbox Interaktif.

### Halaman 7: Kontak & Lokasi (`kontak/index.html`)
- **CSS Khusus:** `assets/css/pages/kontak.css`
- **JS Khusus:** `assets/js/pages/kontak.js`
- **Komponen SSOT Digunakan:** Header (`Ya`), Footer (`Ya`), Sidebar (`Tidak`).
- **Data SSOT Dimuat:** Kontak data terpusat.
- **Section Layout:** Header Kontak, Dua Kolom (Info Kontak & Jam Pelayanan di Kiri, Form Kirim Aspirasi/Pesan di Kanan), Embed Peta Google Maps Jl. Rajawali No. 51 Punggul Gedangan.

---

## 7. Status Implementasi Proyek

| Halaman / Fitur | Berkas HTML | CSS & JS Terkait | Uji Mobile (320px) | Validasi Tools | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Beranda** | `index.html` | `home.css`, `home.js` | [x] | [x] | Completed |
| **Profil Sekolah** | `profil/index.html` | `profil.css`, `profil.js` | [x] | [x] | Completed |
| **Akademik & Kesiswaan** | `akademik/index.html` | `akademik.css`, `akademik.js` | [x] | [x] | Completed |
| **Warta & Pengumuman** | `berita/index.html` | `berita.css`, `berita.js` | [x] | [x] | Completed |
| **SPMB / PPDB** | `spmb/index.html` | `spmb.css`, `spmb.js` | [x] | [x] | Completed |
| **Galeri Kegiatan** | `galeri/index.html` | `galeri.css`, `galeri.js` | [x] | [x] | Completed |
| **Kontak & Lokasi** | `kontak/index.html` | `kontak.css`, `kontak.js` | [x] | [x] | Completed |

Keterangan Status:
- `Planned` — Rancangan arsitektur dan spesifikasi telah ditetapkan di STRUKTUR.md.
- `In Progress` — Sedang dalam tahap pengkodean modular.
- `Quality Checking` — Telah selesai dikoding, sedang diuji responsivitas 320px dan diverifikasi via `python tools/validate_project.py`.
- `Completed` — Telah lulus uji, 0 broken link, 0 error, dan siap rilis.