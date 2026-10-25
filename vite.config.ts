/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 相對路徑：放在 GitHub Pages 子目錄或 Netlify 根目錄都能正常載入
  base: './',
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
