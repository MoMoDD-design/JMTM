
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: Removed manual process.env.API_KEY definition and loadEnv to resolve 'process.cwd()' type error.
// Adheres to guidelines stating that the API key is automatically injected into process.env.API_KEY
// and should not be manually defined in the code.
export default defineConfig({
  plugins: [react()],
});
