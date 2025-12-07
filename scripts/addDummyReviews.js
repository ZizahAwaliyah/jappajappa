// Script untuk menambahkan dummy reviews ke Firestore
// Jalankan dengan: node scripts/addDummyReviews.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyCTxUxarVP6NsKT74FDyDFkC1irsb8Ny5Y",
  authDomain: "jappajappa-47796.firebaseapp.com",
  projectId: "jappajappa-47796",
  storageBucket: "jappajappa-47796.firebasestorage.app",
  messagingSenderId: "551636996244",
  appId: "1:551636996244:web:6d3f99a81942036e932481",
  measurementId: "G-YTXMC8DM02"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data dummy reviews
const dummyReviews = [
  {
    userName: "Siti Nurhaliza",
    rating: 5,
    comment: "Tempatnya sangat indah! Pemandangannya luar biasa, cocok banget untuk liburan keluarga. Fasilitasnya juga lengkap dan bersih. Pasti akan kembali lagi!",
    daysAgo: 2
  },
  {
    userName: "Budi Santoso",
    rating: 4,
    comment: "Pengalaman yang menyenangkan. Lokasinya mudah dijangkau dan suasananya tenang. Hanya saja agak ramai di akhir pekan, tapi overall recommended!",
    daysAgo: 5
  },
  {
    userName: "Dewi Lestari",
    rating: 5,
    comment: "Subhanallah, indahnya! Spot foto banyak banget dan Instagramable. Petugasnya juga ramah-ramah. Worth it banget datang ke sini!",
    daysAgo: 7
  },
  {
    userName: "Ahmad Rizki",
    rating: 4,
    comment: "Tempat wisata yang bagus untuk healing. Udaranya sejuk dan pemandangannya asri. Makanan di sekitar juga enak-enak. Recommended!",
    daysAgo: 10
  },
  {
    userName: "Rina Kusuma",
    rating: 5,
    comment: "Sempurna! Dari awal masuk sampai pulang semuanya memuaskan. Anak-anak juga senang banget. Terima kasih untuk pengalaman yang tak terlupakan!",
    daysAgo: 14
  },
  {
    userName: "Fajar Nugroho",
    rating: 3,
    comment: "Lumayan bagus, tapi harga tiket masuk agak mahal menurut saya. Tapi kalau untuk pengalaman sekali-kali boleh lah dicoba.",
    daysAgo: 20
  }
];

async function addDummyReviewsToWisata(wisataId, wisataTitle, wisataImage) {
  console.log(`\n🎯 Menambahkan ${dummyReviews.length} review dummy untuk wisata: ${wisataTitle}\n`);

  try {
    for (let i = 0; i < dummyReviews.length; i++) {
      const review = dummyReviews[i];

      // Hitung timestamp berdasarkan daysAgo
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - review.daysAgo);

      const reviewData = {
        wisataId: wisataId,
        wisataTitle: wisataTitle,
        wisataImage: wisataImage || "",
        userId: `dummy-user-${i + 1}`,
        userName: review.userName,
        userPhoto: "",
        rating: review.rating,
        comment: review.comment,
        createdAt: Timestamp.fromDate(createdAt)
      };

      await addDoc(collection(db, "reviews"), reviewData);
      console.log(`✅ Review ${i + 1}/${dummyReviews.length} ditambahkan - ${review.userName} (${review.rating}⭐)`);
    }

    console.log(`\n✨ Berhasil menambahkan ${dummyReviews.length} review dummy!\n`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error menambahkan review:", error);
    process.exit(1);
  }
}

// GANTI DATA DI BAWAH INI SESUAI WISATA YANG INGIN DITAMBAHKAN REVIEW
// Anda bisa mendapatkan wisataId dari URL wisata detail (contoh: /wisata/abc123)
const WISATA_ID = "YOUR_WISATA_ID"; // Ganti dengan ID wisata dari Firestore
const WISATA_TITLE = "Pantai Losari"; // Ganti dengan nama wisata
const WISATA_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"; // Ganti dengan URL gambar wisata

// Validasi sebelum menjalankan
if (WISATA_ID === "YOUR_WISATA_ID") {
  console.error("\n❌ ERROR: Harap ganti WISATA_ID, WISATA_TITLE, dan WISATA_IMAGE terlebih dahulu!\n");
  console.log("Cara menggunakan script ini:");
  console.log("1. Buka halaman wisata di browser (misal: /wisata/abc123)");
  console.log("2. Salin ID wisata dari URL (bagian setelah /wisata/)");
  console.log("3. Edit file ini dan ganti nilai WISATA_ID, WISATA_TITLE, dan WISATA_IMAGE");
  console.log("4. Jalankan: node scripts/addDummyReviews.js\n");
  process.exit(1);
}

// Jalankan fungsi
addDummyReviewsToWisata(WISATA_ID, WISATA_TITLE, WISATA_IMAGE);
