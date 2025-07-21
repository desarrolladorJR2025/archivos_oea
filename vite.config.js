import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/archivos-oea/', 
  plugins: [react()],
  server: {
    fs: {
      allow: [resolve(__dirname, 'src')],
    },
  },
})
