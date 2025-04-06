import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // 맞춤 도메인을 사용할 때는 루트 경로로 설정
  plugins: [react()],
});
