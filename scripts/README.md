# 📍 Script untuk Menambahkan Koordinat Peta

Script-script ini membantu Anda menambahkan data koordinat (latitude & longitude) ke Firebase untuk menampilkan peta di halaman detail wisata dan event.

## 🎯 Cara Menggunakan

### **Langkah 1: Lihat Daftar Document**

Jalankan script ini untuk melihat semua document ID dari wisata dan event:

```bash
node scripts/list-documents.js
```

Output akan menampilkan:
- Document ID
- Nama wisata/event
- Lokasi
- Status koordinat (sudah ada atau belum)

### **Langkah 2: Dapatkan Koordinat dari Google Maps**

Untuk setiap wisata/event, dapatkan koordinatnya:

1. Buka [Google Maps](https://maps.google.com)
2. Cari lokasi wisata/event
3. Klik kanan pada marker → pilih koordinat yang muncul
4. Salin koordinat (format: `-6.200000, 106.816666`)

**Atau dari URL Google Maps:**
- URL seperti: `https://maps.google.com/?q=-6.200000,106.816666`
- Ambil angka setelah `?q=`

### **Langkah 3: Edit Script Update Koordinat**

Buka file `scripts/add-coordinates.js` dan edit bagian ini:

```javascript
// DATA KOORDINAT WISATA
const wisataCoordinates = {
  "document_id_wisata_1": { latitude: -6.200000, longitude: 106.816666 },
  "document_id_wisata_2": { latitude: -6.175110, longitude: 106.865039 },
  // Tambahkan semua wisata Anda di sini...
};

// DATA KOORDINAT EVENT
const eventCoordinates = {
  "document_id_event_1": { latitude: -6.200000, longitude: 106.816666 },
  "document_id_event_2": { latitude: -6.175110, longitude: 106.865039 },
  // Tambahkan semua event Anda di sini...
};
```

**Ganti:**
- `document_id_wisata_1` → dengan Document ID dari Firebase
- `-6.200000` → dengan latitude yang sebenarnya
- `106.816666` → dengan longitude yang sebenarnya

### **Langkah 4: Jalankan Script Update**

Setelah semua data koordinat diisi, jalankan:

```bash
node scripts/add-coordinates.js
```

Script akan otomatis update semua document di Firebase.

## 📋 Alternatif: Update Manual via Firebase Console

Jika Anda lebih suka update manual:

1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Klik **Firestore Database**
4. Pilih collection `wisata` atau `events`
5. Klik document yang ingin diedit
6. Klik **Add field** atau **Edit**
7. Tambahkan 2 field:
   - **Field name:** `latitude` | **Type:** `number` | **Value:** `-6.200000`
   - **Field name:** `longitude` | **Type:** `number` | **Value:** `106.816666`
8. Klik **Update**

## 🗺️ Contoh Koordinat Lokasi Populer di Jakarta

```javascript
// Monas
{ latitude: -6.1754, longitude: 106.8272 }

// Kota Tua Jakarta
{ latitude: -6.1352, longitude: 106.8133 }

// Taman Mini Indonesia Indah (TMII)
{ latitude: -6.3024, longitude: 106.8952 }

// Ancol
{ latitude: -6.1224, longitude: 106.8421 }

// Grand Indonesia
{ latitude: -6.1954, longitude: 106.8230 }
```

## ✅ Verifikasi

Setelah menambahkan koordinat:

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka halaman detail wisata atau event
3. Peta akan muncul jika koordinat sudah ditambahkan

## 🆘 Troubleshooting

**Peta tidak muncul?**
- Pastikan field `latitude` dan `longitude` sudah ada di database
- Cek apakah nilainya bertipe `number`, bukan `string`
- Pastikan format koordinat benar (latitude: -90 hingga 90, longitude: -180 hingga 180)

**Error saat menjalankan script?**
- Pastikan file `.env.local` sudah ada dan terisi dengan benar
- Pastikan `dotenv` sudah terinstall: `npm install --save-dev dotenv`
- Cek koneksi internet dan akses ke Firebase

## 📞 Butuh Bantuan?

Jika ada masalah, hubungi developer atau buka issue di repository.
