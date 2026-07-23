import type { NextConfig } from 'next';

// Адрес Spring-бэкенда. В деве это localhost:8080 (./gradlew bootRun).
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080';

// API_MOCK=1 - фронт ходит в локальный мок-бэкенд (src/app/api/auth/*) вместо
// реального Spring. Включается через .env.local, пока бэк за nginx не поднят.
const USE_MOCK = process.env.API_MOCK === '1';

const nextConfig: NextConfig = {
  async rewrites() {
    // Мок включён - прокси нет, /api/* обслуживают файловые route-обработчики.
    if (USE_MOCK) return [];

    // Проксируем /api/* на бэкенд ДО файловых роутов (beforeFiles), чтобы
    // мок-обработчики его не перехватывали. Один origin - куки без CORS.
    return {
      beforeFiles: [{ source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }],
    };
  },
  allowedDevOrigins: ['192.168.1.59'],
};

export default nextConfig;
