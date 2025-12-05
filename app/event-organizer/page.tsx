'use client';

import React, { useState } from 'react';
import { Search, Filter, User, Clock, AlertTriangle, X } from 'lucide-react';

// --- DEFINISI TIPE & DATA (Inline agar Preview Berjalan Lancar) ---

type TabType = 'Actual' | 'Draft' | 'Waiting For Approve' | 'Archive' | 'Decline';
type CategoryType = 'Semua' | 'Konser' | 'Festival' | 'Pameran';

interface EventData {
  id: number;
  title: string;
  location: string;
  price: number;
  status: TabType;
  category: CategoryType;
  image: string;
  sentTime?: string;
  date?: string; 
}

// Data Master (Nanti bisa dipindahkan ke file terpisah di VS Code Anda jika ingin lebih rapi)
const masterEventsData: EventData[] = [
  { id: 1, title: 'Jakarta Fair Fest', location: 'Pipo Mall Makassar', price: 100000, status: 'Actual', category: 'Festival', image: '/placeholder.jpg', date: '24 Nov 2023' },
  { id: 2, title: 'Music Concert A', location: 'Trans Studio', price: 150000, status: 'Actual', category: 'Konser', image: '/placeholder.jpg', date: '10 Des 2023' },
  { id: 3, title: 'Art Exhibition', location: 'Museum Macan', price: 75000, status: 'Draft', category: 'Pameran', image: '/placeholder.jpg', date: '15 Des 2023' },
  { id: 4, title: 'Food Festival', location: 'GBK Parkir Timur', price: 50000, status: 'Draft', category: 'Festival', image: '/placeholder.jpg', date: '20 Des 2023' },
  { id: 5, title: 'Tech Summit', location: 'JCC Senayan', price: 250000, status: 'Waiting For Approve', category: 'Pameran', image: '/placeholder.jpg', sentTime: '1 hour ago', date: '01 Jan 2024' },
  { id: 9, title: 'Startup Launch', location: 'Ritz Carlton', price: 0, status: 'Waiting For Approve', category: 'Pameran', image: '/placeholder.jpg', sentTime: '2 hours ago', date: '12 Jan 2024' },
  { id: 10, title: 'Charity Run', location: 'Monas', price: 150000, status: 'Waiting For Approve', category: 'Festival', image: '/placeholder.jpg', sentTime: '5 mins ago', date: '05 Feb 2024' },
  { id: 11, title: 'Gaming Expo', location: 'ICE BSD', price: 50000, status: 'Waiting For Approve', category: 'Pameran', image: '/placeholder.jpg', sentTime: '1 day ago', date: '10 Feb 2024' },
  { id: 6, title: 'Old Jazz Night', location: 'Pipo Mall Makassar', price: 100000, status: 'Archive', category: 'Konser', image: '/placeholder.jpg', date: '20 Okt 2023' },
  { id: 7, title: 'Summer Party', location: 'Pantai Indah Kapuk', price: 120000, status: 'Decline', category: 'Festival', image: '/placeholder.jpg', date: '15 Nov 2023' },
  { id: 8, title: 'Indie Fest', location: 'Lapangan Blok S', price: 85000, status: 'Decline', category: 'Konser', image: '/placeholder.jpg', date: '18 Nov 2023' },
];

export default function EventOrganizerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Actual');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('Semua');

  // Filter data berdasarkan Tab, Search, dan Kategori
  const filteredEvents = masterEventsData.filter(event => {
    const matchTab = event.status === activeTab;
    const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || event.category === selectedCategory;

    return matchTab && matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans" onClick={() => setIsFilterOpen(false)}>
      
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-20">
        <nav className="flex gap-8 overflow-x-auto no-scrollbar">
          {['Actual', 'Draft', 'Waiting For Approve', 'Archive', 'Decline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`text-lg font-bold transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-red-600' 
                  : 'text-black hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <span className="font-bold text-black hidden md:block">Event Organizer</span>
          <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            <User size={24} />
          </div>
        </div>
      </header>

      {/* Toolbar: Search & Filter */}
      <div className="px-8 py-6 flex justify-end items-center gap-4 relative">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Cari event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 rounded-full transition-colors ${
              isFilterOpen || selectedCategory !== 'Semua' ? 'bg-gray-100 text-black' : 'hover:bg-gray-100'
            }`}
          >
            <Filter size={20} />
          </button>
          
          {selectedCategory !== 'Semua' && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
          )}

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-30 py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Filter</span>
                {selectedCategory !== 'Semua' && (
                  <button onClick={() => setSelectedCategory('Semua')} className="text-xs text-red-500 hover:underline">Reset</button>
                )}
              </div>
              {(['Konser', 'Festival', 'Pameran'] as CategoryType[]).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(selectedCategory === category ? 'Semua' : category);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-between ${
                    selectedCategory === category ? 'text-red-600 bg-red-50' : 'text-gray-700'
                  }`}
                >
                  {category}
                  {selectedCategory === category && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <main className="px-8 pb-12">
        {selectedCategory !== 'Semua' && (
          <div className="mb-6 flex items-center gap-2">
            <span className="text-sm text-gray-500">Menampilkan kategori:</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold flex items-center gap-2">
              {selectedCategory}
              <button onClick={() => setSelectedCategory('Semua')} className="hover:text-red-500">
                <X size={14} />
              </button>
            </span>
          </div>
        )}

        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>Tidak ada event {selectedCategory !== 'Semua' ? `kategori ${selectedCategory}` : ''} di tab ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-komponen Event Card
const EventCard = ({ event }: { event: EventData }) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full group">
      
      {/* Gambar & Status Overlay */}
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        {/* Placeholder Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/checkered-light-emboss.png')]"></div>
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 uppercase tracking-wider shadow-sm">
          {event.category}
        </div>
        
        {event.status === 'Decline' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-white animate-in fade-in">
            <AlertTriangle size={48} className="text-red-500 mb-3 drop-shadow-lg" fill="currentColor" stroke="white" strokeWidth={1.5} />
            <span className="font-bold text-xl drop-shadow-md tracking-wide">Event Declined</span>
          </div>
        )}
        
        {event.status === 'Archive' && (
          <button className="absolute top-3 right-3 z-10 font-bold text-black text-sm hover:underline bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">Pulihkan</button>
        )}
      </div>

      {/* Konten & Footer */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-lg">{event.title}</h3>
        
        {event.status === 'Archive' && (
          <p className="text-xs text-red-600 font-bold mb-2 uppercase tracking-wide">This event has officially ended.</p>
        )}
        
        <div className="flex-grow min-h-[20px]"></div>

        {/* Footer Variabel Berdasarkan Status */}
        {['Actual', 'Archive', 'Decline'].includes(event.status) && (
          <div className="flex justify-between items-end text-xs text-gray-500 mt-2 pt-4 border-t border-gray-50">
            <span className="truncate max-w-[50%]">{event.location}</span>
            <span className="font-bold text-black">Harga mulai {event.price.toLocaleString('id-ID')}</span>
          </div>
        )}
        
        {event.status === 'Waiting For Approve' && (
          <div className="flex justify-between items-center mt-2 pt-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-50">
               <Clock size={20} className="text-yellow-500" />
            </div>
            <div className="px-4 py-1.5 bg-gray-200 rounded-full text-xs font-bold text-gray-800">
              Sent {event.sentTime || 'recently'}
            </div>
          </div>
        )}
        
        {event.status === 'Draft' && (
          <div className="grid grid-cols-2 gap-3 mt-2 pt-2">
            <button className="py-2 px-4 bg-gray-200 text-gray-700 font-bold text-sm rounded-full hover:bg-gray-300 transition-colors">Edit</button>
            <button className="py-2 px-4 bg-green-500 text-white font-bold text-sm rounded-full hover:bg-green-600 transition-colors shadow-sm">Send</button>
          </div>
        )}
      </div>
    </div>
  );
};