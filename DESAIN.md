# Design System & Visual Direction — SDN Punggul 02

Dokumen ini merupakan acuan visual tunggal (*Visual Single Source of Truth*) bagi seluruh halaman website **SDN Punggul 02**.

Seluruh developer dan AI Agent wajib membaca dokumen ini dan **mendefinisikan variabel token desain di `assets/css/base/variables.css` sebelum menulis kode styling komponen atau halaman**.

---

## 1. Identitas Visual & Arahan Kreatif
- **Nama Brand / Entitas:** SDN Punggul 02 (Sekolah Dasar Negeri Punggul 02, Gedangan, Sidoarjo)
- **Kepribadian Brand:**
  - **Edukatif & Terpercaya:** Mencerminkan mutu akademik, ketertiban, dan integritas sekolah negeri di bawah naungan Dinas Pendidikan.
  - **Ramah Anak & Hangat:** Lingkungan belajar yang aman, inklusif, menyenangkan (*child-friendly school*), dan mendukung tumbuh kembang karakter siswa.
  - **Berprestasi & Berakhlak:** Menjunjung tinggi nilai religius, Profil Pelajar Pancasila, kejuaraan akademik & seni, serta pembiasaan positif harian.
  - **Berwawasan Lingkungan (Adiwiyata):** Menghadirkan atmosfer asri, bersih, dan peduli kelestarian alam sekitar sekolah.
- **Target Pengguna Utama:**
  - Orang tua dan wali murid siswa aktif (melihat pengumuman, kalender akademik, agenda kegiatan).
  - Calon orang tua/wali murid pendaftar SPMB/PPDB (mencari informasi zonasi, syarat pendaftaran, profil keunggulan).
  - Guru dan Tenaga Kependidikan (GTK) (akses administrasi, publikasi karya & berita).
  - Siswa sekolah dasar (melihat dokumentasi kegiatan, ekstrakurikuler, dan prestasi).
  - Pengawas sekolah dan masyarakat sekitar Gedangan - Sidoarjo.
- **Industri / Karakter Lembaga:** Pendidikan Dasar Negeri (Primary / Elementary Education).
- **Nuansa Visual yang Dituju:**
  - Bersih, teratur, bernuansa akademis sejuk (*scholastic freshness*), ramah bagi pengguna ponsel orang tua, serta memiliki keterbacaan tipografi yang sangat tinggi.
- **Karakteristik Desain yang Dilarang:**
  - Dilarang membuat tampilan generik yang menyerupai template AI murahan tanpa sentuhan identitas sekolah.
  - Dilarang menggunakan kombinasi warna acak yang menyilaukan mata anak-anak atau orang tua.
  - Dilarang menggunakan efek glassmorphism berlebihan, bayangan hitam pekat, atau gradasi warna menyengat.
  - Dilarang menempatkan ikon atau gambar dekoratif tanpa nilai informasi nyata bagi warga sekolah.

---

## 2. Registri Design Tokens Wajib (`assets/css/base/variables.css`)

Sebelum menulis file CSS lainnya, daftarkan seluruh nilai dasar ini ke dalam `:root` pada berkas `assets/css/base/variables.css`:

### A. Palet Warna (Color System) & Filosofi Harmoni
Warna utama website SDN Punggul 02 adalah **Deep Academic Blue (`#14628a`)**. Palet pendamping dan aksen disusun dengan harmoni warna terukur:
1. **Primary (`#14628a`):** Biru Samudera Edukatif — melambangkan kestabilan institusi, kedalaman ilmu pengetahuan, integritas pendidik, dan rasa aman bagi siswa.
2. **Primary Hover (`#0d4866`):** Varian lebih gelap untuk respon interaktif tombol primer dan link aktif.
3. **Primary Light (`#eaf4f9`):** Tint lembut sejuk untuk background kartu sorotan, header tabel, dan background seksi selang-seling.
4. **Secondary (`#2a9d8f`):** Teal Edukasi / Toska Pertumbuhan — harmoni analog yang melambangkan kepedulian lingkungan hidup (Sekolah Ramah Anak & Adiwiyata), kesegaran jasmani, dan kreativitas siswa.
5. **Accent (`#f59e0b`):** Amber Gold / Kuning Emas Prestasi — harmoni split-komplementer hangat yang melambangkan bintang prestasi juara, keceriaan anak, serta tombol CTA pendaftaran SPMB/PPDB yang menonjol ramah.

```css
:root {
  /* Brand Colors — SDN Punggul 02 */
  --color-primary: #14628a;
  --color-primary-hover: #0d4866;
  --color-primary-light: #eaf4f9;
  --color-secondary: #2a9d8f;
  --color-secondary-hover: #207a6f;
  --color-secondary-light: #e8f7f5;
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-accent-light: #fef3c7;

  /* Neutral & Surface Colors */
  --color-bg-body: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-subtle: #f1f5f9;
  --color-text-main: #0f1e29;
  --color-text-muted: #52667a;
  --color-border: #e2e8f0;
  --color-border-hover: #cbd5e1;

  /* Status Colors */
  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
  --color-info: #0284c7;
}

/* Dark Mode Tokens Override */
html.dark-mode {
  --color-bg-body: #0a141d;
  --color-surface: #132533;
  --color-surface-subtle: #1a3245;
  --color-text-main: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-border: #1e384d;
  --color-border-hover: #294d69;
  --color-primary: #38bdf8;
  --color-primary-hover: #7dd3fc;
  --color-primary-light: #16384f;
  --color-secondary: #2dd4bf;
  --color-secondary-hover: #5eead4;
  --color-secondary-light: #133a37;
  --color-accent: #fbbf24;
  --color-accent-hover: #fcd34d;
  --color-accent-light: #3d2f0a;
}
```

### B. Spacing & Container System
Gunakan skala spacing proporsional untuk menjaga ritme visual yang konsisten dan rapi:
```css
:root {
  --space-2xs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;

  --container-max-width: 1200px;
  --container-padding: 16px;
}

@media (min-width: 768px) {
  :root {
    --container-padding: 24px;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: 32px;
  }
}
```

### C. Border Radius & Layered Elevation (Shadows Modern)
Gunakan sudut membulat ramah anak (*friendly radius*) dan bayangan lembut bertingkat (*layered elevation*):
```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(15, 30, 41, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(15, 30, 41, 0.07), 0 2px 4px -2px rgba(15, 30, 41, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(15, 30, 41, 0.08), 0 4px 6px -4px rgba(15, 30, 41, 0.04);
}
```

---

## 3. Tipografi, Keterbacaan, dan Font Smoothing

Font dipilih dengan mempertimbangkan kemudahan baca bagi para wali murid lintas usia dan tampilan yang bersih di layar smartphone:
- **Font Utama (Body):** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`
- **Font Heading (Judul):** Sans-serif modern berbobot tegas (`600` / `700` / `800`), proporsional, dan bersahabat.

### Aturan Font Rendering Halus:
Wajib terapkan perataan subpiksel font halus di `body`:
```css
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

Skala Hierarki Tipografi:
- `h1` — Mobile: `1.875rem (30px)` | Desktop: `2.5rem (40px)` | Weight: `800`
- `h2` — Mobile: `1.5rem (24px)` | Desktop: `2.0rem (32px)` | Weight: `700`
- `h3` — Mobile: `1.25rem (20px)` | Desktop: `1.5rem (24px)` | Weight: `600`
- `Body text` — Ukuran: `1rem (16px)` | Line-height: `1.6` | Weight: `400`
- `Small text / Caption` — Ukuran: `0.875rem (14px)` | Line-height: `1.4`

---

## 4. Standar UI/UX Mobile: Tap Highlight & Touch Target

### A. Wajib Hilangkan Tap Highlight Kasar
Untuk mencegah kotak sorotan abu-abu/biru bawaan browser smartphone saat elemen disentuh:
```css
*,
*::before,
*::after {
  -webkit-tap-highlight-color: transparent;
}
```

### B. Ukuran Area Sentuh Minimum (Touch Target $\ge$ 44x44px)
Seluruh tombol navigasi, tautan menu, tombol WhatsApp kontak, hamburger drawer, dan tombol formulir SPMB wajib memiliki dimensi sentuh minimal $44 \times 44\text{px}$. Orang tua siswa yang mengakses website dari HP tidak boleh kesulitan mengetuk elemen navigasi.

---

## 5. Larangan `-webkit-line-clamp` & Solusi Desain Card yang Benar

Dilarang keras memotong teks menggunakan kombinasi rapuh:
`display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;`

### Solusi Desain yang Diwajibkan:
1. **Flex Column dengan Auto Margin:** Desain seluruh card berita, profil GTK, agenda, dan ekstrakurikuler menggunakan kolom flex, lalu berikan `margin-top: auto` pada tombol aksi/CTA di bagian bawah:
   ```css
   .card {
     display: flex;
     flex-direction: column;
   }
   .card .card-action {
     margin-top: auto;
   }
   ```
2. **Ringkasan Teks pada Data Source (SSOT):** Buat atribut `ringkasan` langsung di file data `assets/data/*.json`.
3. **Single Line Ellipsis:** Jika hanya memotong 1 baris judul pendek:
   ```css
   .truncate-single {
     white-space: nowrap;
     overflow: hidden;
     text-overflow: ellipsis;
   }
   ```

---

## 6. Sistem Breakpoint Standar (Mobile First)

Seluruh media query wajib disusun secara bertahap naik menggunakan patokan baku:

| Nama Layar | Rentang Lebar (Viewport) | Karakteristik Desain |
| :--- | :--- | :--- |
| **Small Mobile** | `320px – 480px` | 1 Kolom penuh, padding container 16px, drawer menu aktif, touch target lega. |
| **Mobile Standard** | `481px – 640px` | 1 Kolom adaptif, kartu berita responsif, tombol CTA besar. |
| **Tablet** | `641px – 1024px` | 2 Kolom grid, bento beralih ke 2 kolom, tata letak seimbang. |
| **Laptop / Desktop** | `1025px – 1280px` | 3–4 Kolom grid, navigasi desktop horizontal penuh, banner hero lebar. |
| **Wide Desktop** | `> 1280px` | Container dibatasi pada `max-width: var(--container-max-width)` dan rata tengah (`margin: 0 auto`). |

---

## 7. Pedoman Tata Letak & Konsep Desain Modern (School Portal Standard)

Website SDN Punggul 02 mengadopsi standar tata letak portal institusi pendidikan modern internasional dengan perpaduan warna identitas biru akademis (`#14628a`), emas prestasi (`#f59e0b`), dan teal edukasi (`#2a9d8f`):

1. **Struktur Header & Topbar:**
   - **Topbar:** Latar belakang dark navy (`#071f2d`) dengan informasi alamat, nomor WhatsApp, email resmi, dan tautan portal (`Portal GTK | Portal Wali Murid | SPMB Online`).
   - **Navbar Bersih:** Latar belakang putih dengan logo sekolah, nama entitas, navigasi menu horizontal, ikon pencarian/tema, dan tombol CTA pill emas `Daftar SPMB →`.

2. **Split Hero & Value Proposition Bar:**
   - **Hero Komposisi:** Judul tajuk serif besar dengan aksen emas italic (*Gemilang*), deskripsi sejuk, tombol primer emas dan tombol sekunder dark outline dengan ikon play/explore.
   - **Floating Value Bar:** Kontainer melayang berbentuk kapsul halus dengan 6 pilar keunggulan (Pendidikan Karakter, Guru Berdedikasi, Lingkungan Ramah Anak, Prestasi Unggul, Kecakapan Abad 21, dan Wawasan Adiwiyata).

3. **Bagian Tentang Sekolah (About Us):**
   - Tiga kolom: Foto kampus dengan tombol *Tur Virtual Sekolah*, deskripsi komitmen sekolah, dan 3 kartu mini bertumpuk (Visi Kami, Misi Kami, Nilai Luhur).

4. **Program Pembelajaran (Academic Programs):**
   - 5 kolom kartu jenjang belajar (Fase A, Fase B, Fase C, Proyek P5, Pembiasaan) dengan footer beraksen pastel lembut dan tombol panah lingkaran `→`.

5. **Banner Statistik "Mengapa Memilih SDN Punggul 02" (Why Choose Us):**
   - Latar belakang dark navy pekat yang elegan dengan 4 kotak statistik emas (Jumlah Siswa, Pendidik, Akreditasi A 100%, dan Ragam Ekskul/Prestasi).

6. **Dinamika Siswa (Vibrant Student Life):**
   - 5 kolom kartu foto kegiatan sekolah dengan label kategori badge berwarna khas di bagian bawah.

7. **Warta Terkini & Testimoni Orang Tua (Two-Column Section):**
   - Kolom kiri: Daftar warta horisontal dengan badge tanggal kotak (`BULAN / TANGGAL`), thumbnail foto, dan tombol lingkaran.
   - Kolom kanan: Kartu ulasan orang tua dengan rating 5 bintang emas, kutipan testimonial, avatar wali murid, serta tombol slider `<` dan `>`.

8. **Mega Footer:**
   - Latar belakang navy malam dengan 6 kolom komprehensif, formulir berlangganan warta, tombol media sosial, dan tautan legal.

---

## 8. Standar Status Interaktif Elemen UI & Aturan Animasi

### A. Definisi Visual Status Interaktif (Interactive States)
1. **Default:** Tampilan awal dengan kontras warna memenuhi WCAG AA/AAA.
2. **Hover:** Efek lembut saat kursor melintas (warna `var(--color-primary-hover)`, elevasi `var(--shadow-md)`, transisi `0.2s ease`).
3. **Active:** Umpan balik visual saat tombol ditekan (`transform: scale(0.98)`).
4. **Focus-Visible (Wajib Aksesibilitas):** Garis tepi tegas (`outline: 2px solid var(--color-primary); outline-offset: 2px;`).
5. **Disabled:** Kontras diturunkan (`opacity: 0.6; cursor: not-allowed; pointer-events: none;`).
6. **Loading & Empty State:** Desain placeholder saat data berita atau GTK sedang dimuat via `fetch()`.

### B. Animasi Tetap Hidup & Larangan prefers-reduced-motion
Dilarang keras menyisipkan `@media (prefers-reduced-motion)` atau mematikan animasi menjadi `0ms` / `none`.
- Pada banyak smartphone wali murid (terutama Android hemat baterai), preferensi *reduced motion* aktif secara otomatis. Penggunaan aturan tersebut mematikan slider, modal, drawer menu, dan animasi visual.
- Semua transisi harus tetap hidup, halus, dan ringan menggunakan `transform` dan `opacity`.

---

## 9. Standar Ikon: Phosphor Icons

Seluruh ikon antarmuka wajib distandarisasi menggunakan **Phosphor Icons**:
* **Pemuatan via CDN Resmi pada `<head>`:**
  ```html
  <script src="https://unpkg.com/@phosphor-icons/web"></script>
  ```
* **Kategori Bobot Ikon:**
  * Regular: `<i class="ph ph-graduation-cap"></i>` (Menu navigasi dan teks informasi)
  * Bold: `<i class="ph-bold ph-phone"></i>` (Tombol aksi dan kontak)
  * Fill: `<i class="ph-fill ph-check-circle"></i>` (Status sukses, akreditasi, dan lencana verifikasi)
* **Aturan Ikonografi:**
  * Dilarang mencampur font-awesome atau icon set lain.
  * Ukuran ikon terstandarisasi: 16px, 20px, atau 24px.

---

## 10. Format Aset Gambar & Favicon

- **Format Gambar:** Seluruh gambar foto dokumentasi wajib dikonversi ke format `.webp`.
- **Rasio Aspek:**
  - 16:9 untuk Banner Hero dan dokumentasi berita utama.
  - 4:3 untuk dokumentasi kegiatan ekstrakurikuler dan sarana prasarana.
  - 1:1 untuk foto profil Kepala Sekolah dan Guru/GTK.
- **Favicon Lengkap:** Menggunakan paket favicon yang telah disiapkan di `assets/img/favicon/` (`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`, dan `site.webmanifest`).
