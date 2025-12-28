
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // 讀取所有環境變數
  const env = loadEnv(mode, process.cwd(), '');
  
  // 優先順序：1. Vercel 控制台變數 2. 本地 .env 檔案 3. 系統 process.env
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // 強制將字串注入到客戶端代碼中
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
