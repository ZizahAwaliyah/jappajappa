// app/page.tsx
import { Search, MapPin } from 'lucide-react';
import BottomNavBar from './components/BottomNavBar';

// --- Data Dummy (untuk mengisi konten) ---
const upcomingEvents = [
  { id: 1, title: 'Konser Musik Senja', location: 'Pantai Losari', image: '/images/event1.jpg' },
  { id: 2, title: 'Pameran RITECH 2025', location: 'CPI Makassar', image: '/images/event2.jpg' },
  { id: 3, title: 'Festival Kuliner Coto', location: 'Fort Rotterdam', image: '/images/event3.jpg' },
];

const topPicks = [
  { id: 1, title: 'Pulau Samalona', description: 'Wisata bahari & snorkeling.', image: '/images/pick1.jpg' },
  { id: 2, title: 'Malino Highlands', description: 'Pemandangan kebun teh sejuk.', image: '/images/pick2.jpg' },
  { id: 3, title: 'Kopi Toko Djawa', description: 'Tempat nongkrong ikonik.', image: '/images/pick3.jpg' },
  { id: 4, title: 'Masjid 99 Kubah', description: 'Ikon religius baru.', image: '/images/pick4.jpg' },
];

const jappaNowItems = [
  { id: 1, title: 'Coto Nusantara', description: 'Rasa otentik, kuah kental.', image: '/images/jappa1.jpg' },
  { id: 2, title: 'Pantai Akkarena', description: 'Menikmati sunset terbaik.', image: '/images/jappa2.jpg' },
];
// ----------------------------------------


export default function HomePage() {
  return (
    <>
      {/* Konten Utama 
        - bg-gray-50: Memberi latar belakang sedikit abu-abu
        - pb-24: Padding bawah agar tidak tertutup BottomNavBar di HP
        - min-h-screen: Memastikan halaman mengisi seluruh layar
      */}
      <main className="bg-gray-50 min-h-screen pb-24 md:pb-8">
        {/* Wrapper untuk membatasi lebar di desktop */}
        <div className="max-w-screen-lg mx-auto">

          {/* === BAGIAN HEADER & SEARCH === */}
          <header className="p-4 md:p-6 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pantai, coto, atau event musik..."
                className="w-full rounded-full border border-gray-300 bg-white py-3 px-5 pl-12 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            </div>
          </header>

          {/* === BAGIAN BANNER CAROUSEL (Placeholder) === */}
          <section className="px-4 md:px-6 mt-2">
            {/* Ganti div ini dengan komponen carousel (mis: Swiper.js) */}
            <div className="h-40 md:h-64 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 shadow">
              [Banner Carousel Placeholder]
            </div>
            {/* Indikator Carousel */}
            <div className="flex justify-center space-x-1.5 mt-3">
              <div className="h-2 w-5 rounded-full bg-blue-600"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            </div>
          </section>

          {/* === BAGIAN EVENT AKAN DATANG === */}
          <section className="mt-6 px-4 md:px-6">
            {/* Card Putih Pembungkus (sesuai wireframe) */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Event akan Datang</h2>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                  Oktober
                </a>
              </div>
              
              {/* Container Scroll Horizontal di HP
                Menjadi Grid di Desktop (md:)
              */}
              <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex-shrink-0 w-36 md:w-full cursor-pointer group">
                    {/* Placeholder Gambar */}
                    <div className="h-48 rounded-xl bg-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105">
                      {/* <Image src={event.image} alt={event.title} layout="fill" objectFit="cover" className="rounded-xl" /> */}
                    </div>
                    <h3 className="font-semibold mt-2 truncate text-gray-800">{event.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 inline-block" />
                      {event.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* === BAGIAN TOP PICKS === */}
          <section className="mt-8 px-4 md:px-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Picks of the Month</h2>
            {/* Container Scroll Horizontal di HP
              Menjadi Grid di Desktop (md:)
            */}
            <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible">
              {topPicks.map((pick) => (
                <div key={pick.id} className="flex-shrink-0 w-40 md:w-full cursor-pointer group">
                  {/* Placeholder Gambar */}
                  <div className="h-40 rounded-xl bg-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {/* <Image src={pick.image} alt={pick.title} layout="fill" objectFit="cover" className="rounded-xl" /> */}
                  </div>
                  <h3 className="font-semibold mt-2 truncate text-gray-800">{pick.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{pick.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* === BAGIAN JAPPA NOW === */}
          <section className="mt-8 px-4 md:px-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Jappa Now!</h2>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">
                Semua &gt;
              </a>
            </div>
            
            {/* List Vertikal */}
            <div className="space-y-3">
              {jappaNowItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 bg-white p-3 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  {/* Placeholder Gambar */}
                  <div className="h-16 w-16 rounded-lg bg-gray-200 flex-shrink-0">
                    {/* <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="rounded-lg" /> */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* === NAVIGASI BAWAH (Hanya muncul di HP) === */}
      <BottomNavBar />
    </>
  );
}