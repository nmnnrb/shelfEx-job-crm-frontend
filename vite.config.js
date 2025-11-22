import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
    allowedHosts: ["9c2f6fb6c95a.ngrok-free.app"],
    host: true, // allows external access
    
  },
})
