import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,          // Exposes to network (0.0.0.0)
    port: 5599,
  },
  plugins: [react()],
 
  base: '/',   // 👈 important
 
 
})