// app/components/EventCountdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
  targetDate: string; // Format ISO: "2025-10-25T10:00:00"
}

export default function EventCountdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  // State untuk memastikan komponen hanya render di client (mencegah hydration error)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        // Event sudah mulai/selesai
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // Jalankan sekali saat mount
    const timer = setInterval(calculateTimeLeft, 1000); // Update tiap detik

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isMounted) return null; // Jangan tampilkan apa-apa saat server rendering

  // Jika waktu habis
  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="bg-linear-to-r from-red-500 to-pink-600 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg shadow-red-500/50">
        🔴 Live Now!
      </div>
    );
  }

  // Tampilan Countdown
  return (
    <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-purple-600/50 border border-white/20">
      <Clock className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}h `}
        {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d
      </span>
    </div>
  );
}