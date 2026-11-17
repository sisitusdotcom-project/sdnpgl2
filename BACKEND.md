# Standar Arsitektur Backend & Panduan Integrasi — SDN Punggul 02

Dokumen ini merupakan panduan teknis resmi bagi AI Agent dan developer saat mengintegrasikan kapabilitas backend, basis data realtime, penyimpanan berkas, dan otomatisasi serverless untuk sistem website **SDN Punggul 02**.

---

## 1. Arsitektur Backend Tiga Pilar (Three-Pillar Standard)

Untuk menghasilkan website sekolah yang handal, cepat, berbiaya efisien ($0 hosting & server cost), dan mudah dirawat:

```text
+-----------------------------------------------------------------------------------+
| 1. BASIS DATA & AUTH         : Firebase Realtime Database (RTDB) & Firebase Auth  |
|    - Menyimpan pendaftaran SPMB/PPDB, pengumuman kilat, pesan aspirasi/kontak     |
+-----------------------------------------------------------------------------------+
                                         │
+-----------------------------------------------------------------------------------+
| 2. PENYIMPANAN MEDIA & BERKAS : Google Drive Storage                              |
|    - Menyimpan scan berkas akta kelahiran, KK, foto siswa, dan bukti prestasi     |
+-----------------------------------------------------------------------------------+
                                         │
+-----------------------------------------------------------------------------------+
| 3. SERVERLESS UPLOAD BRIDGE  : Google Apps Script (GAS) Web App                  |
|    - Menerima formulir & berkas pendaftaran dari web client, mengunggah ke Drive, |
|      lalu mencatat ID berkas ke RTDB tanpa membocorkan kredensial rahasia         |
+-----------------------------------------------------------------------------------+
```

---

## 2. Setup Firebase Realtime Database (RTDB)

### A. Persiapan Proyek di Firebase Console
1. Buat proyek baru di [Firebase Console](https://console.firebase.google.com/) dengan nama `sdn-punggul-02`.
2. Aktifkan **Authentication** jika sistem membutuhkan login guru/admin (pilih metode Email/Password).
3. Buat **Realtime Database** pada menu *Build -> Realtime Database* (disarankan region Asia Tenggara `asia-southeast1`).
4. Catat `databaseURL` proyek Anda (format: `https://sdn-punggul-02-default-rtdb.asia-southeast1.firebasedatabase.app/`).

### B. Konfigurasi Klien (`assets/js/base/firebase-config.js`)
Buat berkas konfigurasi publik di sisi client. Karena konfigurasi client Firebase bersifat publik, lindungi data menggunakan **Firebase Security Rules**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sdn-punggul-02.firebaseapp.com",
  databaseURL: "https://sdn-punggul-02-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sdn-punggul-02",
  storageBucket: "sdn-punggul-02.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};

if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}
```

### C. Keamanan Database (`database.rules.json`)
Aturan keamanan disesuaikan dengan kebutuhan publikasi sekolah dan formulir pendaftaran:

```json
{
  "rules": {
    "pengumuman": {
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.uid).exists()"
    },
    "spmb_registrations": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      "$regId": {
        ".write": "!data.exists() && newData.exists()"
      }
    },
    "pesan_kontak": {
      ".read": "auth != null && root.child('admins').child(auth.uid).exists()",
      "$msgId": {
        ".write": "!data.exists() && newData.exists()"
      }
    },
    "admins": {
      ".read": "auth != null",
      ".write": false
    }
  }
}
```

---

## 3. Tooling Admin & Migrasi Data (`backend-tools/`)

Untuk migrasi data massal, backup, atau administrasi server, buat folder terisolasi `backend-tools/` berbasis Node.js dan Firebase Admin SDK.

```text
backend-tools/
├── package.json
├── database.rules.json
├── keys/
│   └── service-account-key.json    # WAJIB masuk .gitignore
├── data/
│   └── initial-rtdb-export.json     # Cetak biru struktur database awal
├── export-db.js
├── import-db.js
└── deploy-rules.js
```

### A. Aturan Wajib `.gitignore`
Pastikan kunci privat (*service account key*) dan dependency tidak ter-commit ke Git:
```gitignore
backend-tools/node_modules/
backend-tools/keys/*.json
```

### B. Mengunduh Kunci Service Account
1. Di Firebase Console, buka *Project Settings -> Service accounts*.
2. Klik tombol **Generate new private key**.
3. Simpan berkas JSON tersebut ke dalam `backend-tools/keys/service-account-key.json`.

### C. Contoh Skrip Import Data Awal (`backend-tools/import-db.js`)
```javascript
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./keys/service-account-key.json');
const databaseURL = "https://sdn-punggul-02-default-rtdb.asia-southeast1.firebasedatabase.app";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
});

const db = admin.database();
const payloadPath = path.join(__dirname, 'data', 'initial-rtdb-export.json');
const rawData = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

db.ref('/').set(rawData)
  .then(() => {
    console.log('Database berhasil diinisialisasi dari berkas export JSON.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Gagal menginisialisasi database:', err);
    process.exit(1);
  });
```

---

## 4. Penyimpanan Berkas Google Drive & Helper URL

Realtime Database dioptimalkan untuk struktur data JSON pohon (*tree*), bukan untuk menyimpan file biner atau string Base64 besar. Seluruh aset gambar dan dokumen pengguna wajib disimpan di **Google Drive**, lalu hanya `fileId` atau link aksesnya yang dicatat di RTDB.

### A. Format Tautan Langsung Google Drive (Direct Streaming)
Gunakan format URL performa tinggi yang tidak memicu halaman preview Drive:
* **Tampilan Gambar / Foto Profil:** `https://lh3.googleusercontent.com/d/{FILE_ID}`
* **Thumbnail Kecil (Opsional):** `https://drive.google.com/thumbnail?id={FILE_ID}&sz=w500`
* **Download Dokumen / PDF:** `https://drive.google.com/uc?export=download&id={FILE_ID}`

### B. Helper Modul (`assets/js/base/drive-utils.js`)
```javascript
const DriveUtils = {
  extractFileId(urlOrId) {
    if (!urlOrId) return '';
    if (!urlOrId.includes('/') && !urlOrId.includes('.')) return urlOrId;
    var match = urlOrId.match(/[-\w]{25,}/);
    return match ? match[0] : urlOrId;
  },
  getImageUrl(fileId) {
    var id = this.extractFileId(fileId);
    return id ? 'https://lh3.googleusercontent.com/d/' + id : '';
  },
  getDownloadUrl(fileId) {
    var id = this.extractFileId(fileId);
    return id ? 'https://drive.google.com/uc?export=download&id=' + id : '';
  }
};
```

---

## 5. Google Apps Script (GAS) sebagai Jembatan Unggah File

Google Apps Script berfungsi sebagai endpoint serverless tanpa biaya (*zero cost serverless*) untuk menerima unggahan file dari formulir web dan menyimpannya langsung ke folder Google Drive tujuan.

### A. Kode Script Google Apps Script (`Code.gs`)
Buat project baru di [script.google.com](https://script.google.com/) dan tempelkan kode berikut:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var folderId = "FOLDER_ID_GOOGLE_DRIVE_ANDA";
    var folder = DriveApp.getFolderById(folderId);
    
    var contentType = data.mimeType || "image/webp";
    var decoded = Utilities.base64Decode(data.base64Data);
    var blob = Utilities.newBlob(decoded, contentType, data.fileName || "upload.webp");
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      fileId: file.getId(),
      url: "https://lh3.googleusercontent.com/d/" + file.getId()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### B. Prosedur Deployment GAS Web App
1. Klik tombol **Deploy** $\rightarrow$ **New deployment**.
2. Pilih jenis **Web app**.
3. Atur:
   - **Execute as:** `Me (akun Google Anda)`.
   - **Who has access:** `Anyone` (agar web client dapat mengirim data).
4. Klik **Deploy** dan salin **Web App URL** yang dihasilkan.
5. Simpan URL tersebut pada file konfigurasi client (misal: `AppConfig.uploadApiUrl`).

---

## 6. Checklist Keamanan & Verifikasi Backend

Sebelum mempublikasikan sistem backend:
- [ ] Berkas `service-account-key.json` dan folder `node_modules` telah terdaftar di `.gitignore`.
- [ ] Database Security Rules (`database.rules.json`) telah diuji dan tidak membiarkan akses publik tanpa izin.
- [ ] Folder Google Drive target telah disetel permission-nya agar dapat diakses oleh skrip GAS.
- [ ] Skrip client menggunakan Web SDK Firebase murni tanpa menumpuk pustaka berat yang tidak dibutuhkan.
- [ ] Eksekusi verifikasi via `python tools/validate_project.py` tetap berstatus **LULUS**.
