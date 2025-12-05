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
      <div className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center">
        Live Now!
      </div>
    );
  }

  // Tampilan Countdown
  return (
    <div className="bg-black/60 backdrop-blur-md text-white text-[10px] md:text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-white/10">
      <Clock className="w-3 h-3 text-yellow-400" />
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}h `}
        {timeLeft.hours}j {timeLeft.minutes}m {timeLeft.seconds}d
      </span>
    </div>
  );
}