import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  },
  build: {
    outDir: 'dist'
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    // React Testing Library necesita los globals de Vitest para registrar su
    // limpieza automática entre pruebas.
    globals: true,
    // El viento anima 3,4 s antes de asentarse en el camino normal.
    testTimeout: 15000,
    restoreMocks: true
  }
});
