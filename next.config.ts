import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Tambahkan domain QR Code di sini
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Promedia Teknologi
      {
        protocol: 'https',
        hostname: 'static.promediateknologi.id',
      },
    ],
  },
};

export default nextConfig;