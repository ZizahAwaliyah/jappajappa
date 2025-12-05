// --- Tipe Data (Interface) ---
export type TabType = 'Actual' | 'Draft' | 'Waiting For Approve' | 'Archive' | 'Decline';
export type CategoryType = 'Semua' | 'Konser' | 'Festival' | 'Pameran';

export interface EventData {
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

// --- Data Master ---
// Ubah status di sini, maka kedua halaman (Admin & User) akan berubah otomatis
export const masterEventsData: EventData[] = [
  // 1. Data ACTUAL (Akan muncul di Dashboard Admin & Halaman User)
  { 
    id: 1, 
    title: 'Jakarta Fair Fest', 
    location: 'Pipo Mall Makassar', 
    price: 100000, 
    status: 'Actual', 
    category: 'Festival', 
    image: '/placeholder.jpg',
    date: '24 Nov 2023'
  },
  { 
    id: 2, 
    title: 'Music Concert A', 
    location: 'Trans Studio', 
    price: 150000, 
    status: 'Actual', 
    category: 'Konser', 
    image: '/placeholder.jpg',
    date: '10 Des 2023'
  },

  // 2. Data LAINNYA (Hanya muncul di Dashboard Admin)
  { 
    id: 3, 
    title: 'Art Exhibition', 
    location: 'Museum Macan', 
    price: 75000, 
    status: 'Draft', 
    category: 'Pameran', 
    image: '/placeholder.jpg',
    date: '15 Des 2023'
  },
  { 
    id: 4, 
    title: 'Food Festival', 
    location: 'GBK Parkir Timur', 
    price: 50000, 
    status: 'Draft', 
    category: 'Festival', 
    image: '/placeholder.jpg',
    date: '20 Des 2023'
  },
  { 
    id: 5, 
    title: 'Tech Summit', 
    location: 'JCC Senayan', 
    price: 250000, 
    status: 'Waiting For Approve', 
    category: 'Pameran', 
    image: '/placeholder.jpg', 
    sentTime: '1 hour ago',
    date: '01 Jan 2024'
  },
  { 
    id: 9, 
    title: 'Startup Launch', 
    location: 'Ritz Carlton', 
    price: 0, 
    status: 'Waiting For Approve', 
    category: 'Pameran', 
    image: '/placeholder.jpg', 
    sentTime: '2 hours ago',
    date: '12 Jan 2024'
  },
  { 
    id: 10, 
    title: 'Charity Run', 
    location: 'Monas', 
    price: 150000, 
    status: 'Waiting For Approve', 
    category: 'Festival', 
    image: '/placeholder.jpg', 
    sentTime: '5 mins ago',
    date: '05 Feb 2024'
  },
  { 
    id: 11, 
    title: 'Gaming Expo', 
    location: 'ICE BSD', 
    price: 50000, 
    status: 'Waiting For Approve', 
    category: 'Pameran', 
    image: '/placeholder.jpg', 
    sentTime: '1 day ago',
    date: '10 Feb 2024'
  },
  { 
    id: 6, 
    title: 'Old Jazz Night', 
    location: 'Pipo Mall Makassar', 
    price: 100000, 
    status: 'Archive', 
    category: 'Konser', 
    image: '/placeholder.jpg',
    date: '20 Okt 2023'
  },
  { 
    id: 7, 
    title: 'Summer Party', 
    location: 'Pantai Indah Kapuk', 
    price: 120000, 
    status: 'Decline', 
    category: 'Festival', 
    image: '/placeholder.jpg',
    date: '15 Nov 2023'
  },
  { 
    id: 8, 
    title: 'Indie Fest', 
    location: 'Lapangan Blok S', 
    price: 85000, 
    status: 'Decline', 
    category: 'Konser', 
    image: '/placeholder.jpg',
    date: '18 Nov 2023'
  },
];