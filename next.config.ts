import type { NextConfig } from 'next';

import { BACKEND_URL, DEV_TOOLS_ENABLED, IS_MOCK_API } from './src/config/env';

const nextConfig: NextConfig = {
  // В проде модуль dev-панели подменяется пустой заглушкой: её код и тестовые
  // данные не попадают в бандл вообще, а не просто «не грузятся».
  turbopack: DEV_TOOLS_ENABLED
    ? undefined
    : { resolveAlias: { '@/components/dev/DevTools': './src/components/dev/DevToolsStub.tsx' } },

  async rewrites() {
    // Мок включён - прокси нет, /api/* обслуживают файловые route-обработчики.
    if (IS_MOCK_API) return [];

    // Проксируем /api/* на бэкенд ДО файловых роутов (beforeFiles), чтобы
    // мок-обработчики его не перехватывали. Один origin - куки без CORS.
    return {
      beforeFiles: [{ source: '/api/:path*', destination: `${BACKEND_URL}/api/:path*` }],
    };
  },
  allowedDevOrigins: ['192.168.1.59'],
};

export default nextConfig;
