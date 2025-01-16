import { resolve } from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Cargar variables de entorno
const envPath = process.env.NODE_ENV === 'production'
  ? resolve(__dirname, '../../.env.production')
  : resolve(__dirname, '../../.env');

config({ path: envPath });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:4000/api/:path*',
        },
      ];
    }
    // En producción, no necesitamos rewrites porque Nginx maneja el proxy
    return [];
  },
};

export default nextConfig;
