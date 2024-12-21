// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Optimizaciones de webpack
  webpack(config, { dev }) {
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `vendor-${packageName.replace('@', '')}`;
            },
          },
        },
      };
    }
    return config;
  },

  // Optimizaciones de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de caché
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Compresión de fuentes
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/fonts/:path*',
          destination: '/static/fonts/:path*',
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  // Configuraciones requeridas para Next.js 15
  analyticsId: undefined,
  optimizeFonts: true,
  outputFileTracing: true,
  swcMinify: true,
};

// @ts-expect-error - Ignorar error de tipos entre versiones de Next.js
module.exports = withBundleAnalyzer(nextConfig);
