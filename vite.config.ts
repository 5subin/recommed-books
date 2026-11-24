import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true, // Vercel run 및 다양한 호스트 접근 허용
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
});
