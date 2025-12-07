"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";

export interface WishlistItem {
  id: string;
  title: string;
  location?: string;
  image?: string;
  addedAt: number;
  type: "wisata" | "event"; // Tipe item: wisata atau event
  date?: string; // Untuk event
  price?: string; // Untuk event
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // If user logged in, subscribe to Firestore wishlists; otherwise use localStorage
  useEffect(() => {
    // Listen auth state
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubAuth();
  }, []);

  // Subscribe to Firestore when userId available
  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (userId) {
      const q = query(collection(db, "wishlists"), where("userId", "==", userId));
      unsub = onSnapshot(q, (snap) => {
        const items: WishlistItem[] = snap.docs.map((d) => {
          const data: any = d.data();
          const addedAt = data.createdAt && data.createdAt.toMillis ? data.createdAt.toMillis() : (data.createdAt ? data.createdAt : Date.now());
          if (data.type === "event") {
            return {
              id: data.eventId || d.id,
              title: data.eventTitle || "",
              image: data.eventImage || "",
              type: "event",
              date: data.eventDate,
              price: data.eventPrice,
              addedAt,
            } as WishlistItem;
          }
          return {
            id: data.wisataId || d.id,
            title: data.wisataTitle || "",
            image: data.wisataImage || "",
            location: data.wisataLocation || "",
            type: "wisata",
            price: data.wisataPrice,
            addedAt,
          } as WishlistItem;
        });
        setWishlist(items);
        setIsLoaded(true);
      }, (err) => {
        console.error('Wishlist subscription error:', err);
      });
    } else {
      // Load wishlist from localStorage for guest
      try {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
          setWishlist(JSON.parse(saved));
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error('Error loading wishlist from localStorage:', err);
        setWishlist([]);
      }
      setIsLoaded(true);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [userId]);

  // Persist local wishlist when not logged in
  useEffect(() => {
    if (!userId && isLoaded) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, userId, isLoaded]);

  const addToWishlist = async (item: Omit<WishlistItem, 'addedAt'>) => {
    if (userId) {
      // add to Firestore
      const data: any = {
        userId,
        type: item.type,
        createdAt: serverTimestamp(),
      };
      if (item.type === 'event') {
        data.eventId = item.id;
        data.eventTitle = item.title;
        data.eventImage = item.image || '';
        data.eventDate = item.date || '';
        data.eventPrice = item.price || '';
      } else {
        data.wisataId = item.id;
        data.wisataTitle = item.title;
        data.wisataImage = item.image || '';
        data.wisataLocation = item.location || '';
        data.wisataPrice = item.price || '';
      }
      await addDoc(collection(db, 'wishlists'), data);
      return;
    }

    // guest: update local state
    setWishlist((prev) => {
      if (prev.some(w => w.id === item.id)) return prev;
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = async (id: string) => {
    if (userId) {
      // delete Firestore doc(s) where eventId/wisataId equals id and userId matches
      try {
        const qEvent = query(collection(db, 'wishlists'), where('userId', '==', userId), where('eventId', '==', id));
        const qWisata = query(collection(db, 'wishlists'), where('userId', '==', userId), where('wisataId', '==', id));
        const snapEvent = await getDocs(qEvent);
        snapEvent.forEach(d => deleteDoc(doc(db, 'wishlists', d.id)));
        const snapWisata = await getDocs(qWisata);
        snapWisata.forEach(d => deleteDoc(doc(db, 'wishlists', d.id)));
      } catch (err) {
        console.error('Error removing wishlist in Firestore:', err);
      }
      return;
    }

    setWishlist((prev) => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
