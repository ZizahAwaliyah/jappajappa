/**
 * Script untuk melihat semua document ID dari wisata dan events
 * Berguna untuk mengetahui ID mana yang perlu ditambahkan koordinatnya
 *
 * CARA MENGGUNAKAN:
 * 1. Pastikan sudah ada file .env.local dengan konfigurasi Firebase
 * 2. Jalankan: node scripts/list-documents.js
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Konfigurasi Firebase dari .env.local
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

async function listDocuments(collectionName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 COLLECTION: ${collectionName.toUpperCase()}`);
  console.log('='.repeat(60));

  try {
    const querySnapshot = await getDocs(collection(db, collectionName));

    if (querySnapshot.empty) {
      console.log(`⚠️  No documents found in '${collectionName}'\n`);
      return;
    }

    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      const hasCoords = data.latitude && data.longitude;

      console.log(`\n${index + 1}. Document ID: ${doc.id}`);
      console.log(`   Title: ${data.title || 'N/A'}`);
      console.log(`   Location: ${data.location || data.address || 'N/A'}`);
      console.log(`   Coordinates: ${hasCoords ? `✅ (${data.latitude}, ${data.longitude})` : '❌ NOT SET'}`);

      if (data.gmapsLink) {
        console.log(`   Google Maps Link: ${data.gmapsLink}`);
      }
    });

    console.log(`\n📊 Total: ${querySnapshot.size} documents`);
  } catch (error) {
    console.error(`❌ Error fetching ${collectionName}:`, error.message);
  }
}

async function main() {
  console.log('\n🚀 Fetching all documents from Firebase...\n');

  await listDocuments('wisata');
  await listDocuments('events');

  console.log('\n' + '='.repeat(60));
  console.log('✨ Done! Use document IDs above to add coordinates.');
  console.log('='.repeat(60) + '\n');

  process.exit(0);
}

main().catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
