import type { NextConfig } from 'next';

// Адрес Spring-бэкенда. В деве это localhost:8080 (./gradlew bootRun).
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  // Проксируем /api/* на бэкенд: браузер видит один origin, поэтому куки
  // сессии и CSRF работают без CORS-настроек.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }];
  },
};

export default nextConfig;
