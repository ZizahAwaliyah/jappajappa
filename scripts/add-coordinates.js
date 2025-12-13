/**
 * Script untuk menambahkan koordinat (latitude & longitude) ke database Firebase
 *
 * CARA MENGGUNAKAN:
 * 1. Edit data koordinat di bawah sesuai dengan wisata/event Anda
 * 2. Jalankan: node scripts/add-coordinates.js
 */

// Import Firebase Admin SDK atau Firebase Client SDK
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, collection, getDocs } = require('firebase/firestore');

// Konfigurasi Firebase (gunakan konfigurasi yang sama dengan .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
// DATA KOORDINAT WISATA
// ========================================
// Format: "document_id": { latitude: number, longitude: number }
// Ganti dengan ID document dan koordinat yang sebenarnya
const wisataCoordinates = {
  // Contoh:
  // "wisata_001": { latitude: -6.200000, longitude: 106.816666 },
  // "wisata_002": { latitude: -6.175110, longitude: 106.865039 },
  // Tambahkan data Anda di sini...
};

// ========================================
// DATA KOORDINAT EVENT
// ========================================
const eventCoordinates = {
  // Contoh:
  // "event_001": { latitude: -6.200000, longitude: 106.816666 },
  // "event_002": { latitude: -6.175110, longitude: 106.865039 },
  // Tambahkan data Anda di sini...
};

// ========================================
// FUNGSI UPDATE KOORDINAT
// ========================================
async function updateCoordinates(collectionName, coordinatesData) {
  console.log(`\n🔄 Updating ${collectionName}...`);

  let successCount = 0;
  let errorCount = 0;

  for (const [docId, coords] of Object.entries(coordinatesData)) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      console.log(`✅ Updated ${docId}: (${coords.latitude}, ${coords.longitude})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error updating ${docId}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 ${collectionName} Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
}

// ========================================
// FUNGSI UNTUK MELIHAT SEMUA DATA (HELPER)
// ========================================
async function listAllDocuments(collectionName) {
  console.log(`\n📋 Listing all documents in '${collectionName}':\n`);

  const querySnapshot = await getDocs(collection(db, collectionName));
  querySnapshot.forEach((doc) => {
    console.log(`ID: ${doc.id}`);
    console.log(`   Title: ${doc.data().title || 'N/A'}`);
    console.log(`   Location: ${doc.data().location || doc.data().address || 'N/A'}`);
    console.log(`   Has Coordinates: ${doc.data().latitude ? 'YES' : 'NO'}`);
    console.log('');
  });
}

// ========================================
// JALANKAN SCRIPT
// ========================================
async function main() {
  console.log('🚀 Starting coordinate update script...\n');

  // Uncomment baris di bawah untuk melihat semua document ID terlebih dahulu
  // await listAllDocuments('wisata');
  // await listAllDocuments('events');

  // Update wisata
  if (Object.keys(wisataCoordinates).length > 0) {
    await updateCoordinates('wisata', wisataCoordinates);
  } else {
    console.log('⚠️  No wisata coordinates to update. Edit wisataCoordinates object first.');
  }

  // Update events
  if (Object.keys(eventCoordinates).length > 0) {
    await updateCoordinates('events', eventCoordinates);
  } else {
    console.log('⚠️  No event coordinates to update. Edit eventCoordinates object first.');
  }

  console.log('\n✨ Script completed!\n');
  process.exit(0);
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
