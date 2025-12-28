import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 讀取 Vercel 環境變數
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // 取得 API KEY
  let apiKey = env.API_KEY || process.env.API_KEY || '';

  // 防呆機制：去除可能誤加的引號
  if (apiKey && apiKey.startsWith('"') && apiKey.endsWith('"')) {
    apiKey = apiKey.slice(1, -1);
  }

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});