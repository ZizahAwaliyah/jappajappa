/**
 * Script untuk auto-extract koordinat dari Google Maps link yang sudah ada
 * dan update ke Firestore
 *
 * CARA MENGGUNAKAN:
 * node scripts/extract-coordinates-from-gmaps.js
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const https = require('https');
const { URL } = require('url');

// Konfigurasi Firebase
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

// Fungsi untuk resolve Google Maps short URL
async function resolveShortUrl(shortUrl) {
  return new Promise((resolve, reject) => {
    https.get(shortUrl, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location);
      } else {
        resolve(shortUrl);
      }
    }).on('error', reject);
  });
}

// Fungsi untuk extract koordinat dari Google Maps URL
async function extractCoordinatesFromUrl(gmapsUrl) {
  try {
    // Resolve shortened URL jika ada
    let fullUrl = gmapsUrl;
    if (gmapsUrl.includes('maps.app.goo.gl') || gmapsUrl.includes('goo.gl')) {
      console.log(`   🔗 Resolving short URL: ${gmapsUrl}`);
      fullUrl = await resolveShortUrl(gmapsUrl);
      console.log(`   ✅ Resolved to: ${fullUrl}`);
    }

    // Extract koordinat dari berbagai format URL Google Maps
    const urlObj = new URL(fullUrl);

    // Format 1: ?q=lat,lng
    const qParam = urlObj.searchParams.get('q');
    if (qParam && qParam.match(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/)) {
      const [lat, lng] = qParam.split(',').map(s => parseFloat(s.trim()));
      return { latitude: lat, longitude: lng };
    }

    // Format 2: /@lat,lng,zoom
    const atMatch = fullUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)z/);
    if (atMatch) {
      return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
    }

    // Format 3: /place/Name/@lat,lng
    const placeMatch = fullUrl.match(/\/place\/[^\/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (placeMatch) {
      return { latitude: parseFloat(placeMatch[1]), longitude: parseFloat(placeMatch[2]) };
    }

    // Format 4: ll=lat,lng
    const llParam = urlObj.searchParams.get('ll');
    if (llParam) {
      const [lat, lng] = llParam.split(',').map(s => parseFloat(s.trim()));
      return { latitude: lat, longitude: lng };
    }

    console.log(`   ⚠️  Could not extract coordinates from URL`);
    return null;
  } catch (error) {
    console.error(`   ❌ Error parsing URL:`, error.message);
    return null;
  }
}

// Fungsi untuk update collection
async function updateCollection(collectionName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📍 Processing: ${collectionName.toUpperCase()}`);
  console.log('='.repeat(60));

  const querySnapshot = await getDocs(collection(db, collectionName));

  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    processed++;

    console.log(`\n${processed}. ${data.title || 'Untitled'} (${docSnapshot.id})`);

    // Skip jika sudah ada koordinat
    if (data.latitude && data.longitude) {
      console.log(`   ✅ Already has coordinates: (${data.latitude}, ${data.longitude})`);
      skipped++;
      continue;
    }

    // Skip jika tidak ada Google Maps link
    if (!data.gmapsLink) {
      console.log(`   ⚠️  No Google Maps link found`);
      skipped++;
      continue;
    }

    // Extract koordinat dari URL
    const coords = await extractCoordinatesFromUrl(data.gmapsLink);

    if (coords) {
      try {
        // Update Firestore
        await updateDoc(doc(db, collectionName, docSnapshot.id), {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log(`   ✅ Updated: (${coords.latitude}, ${coords.longitude})`);
        updated++;
      } catch (error) {
        console.error(`   ❌ Failed to update:`, error.message);
        failed++;
      }
    } else {
      console.log(`   ❌ Could not extract coordinates`);
      failed++;
    }

    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n📊 ${collectionName.toUpperCase()} Summary:`);
  console.log(`   Total: ${processed}`);
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped (already has coords): ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
}

// Main function
async function main() {
  console.log('\n🚀 Auto-extracting coordinates from Google Maps links...\n');

  try {
    await updateCollection('wisata');
    await updateCollection('events');

    console.log('\n' + '='.repeat(60));
    console.log('✨ Extraction complete!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('💥 Fatal error:', error);
  }

  process.exit(0);
}

main();
