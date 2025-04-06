import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ClassyRoom/', // GitHub Pages 배포를 위한 base 경로 설정
  plugins: [react()],
});
