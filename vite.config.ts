
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 讀取所有環境變數
  // Fix: Cast process to any to avoid TypeScript error about missing cwd property
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // 優先順序：1. Vercel 控制台變數 2. 本地 .env 檔案 3. 系統 process.env
  let apiKey = env.API_KEY || process.env.API_KEY || '';

  // 防呆機制：如果使用者在 Vercel 設定時不小心多加了前後引號 (例如 "AIza...")，自動去除
  if (apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1);
  }

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
