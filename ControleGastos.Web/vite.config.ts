import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:5000',  // Endereço do backend
        changeOrigin: true,
        secure: false,  // Se estiver usando https e tiver problema com certificados
        rewrite: (path) => path.replace(/^\/api/, ''), // Remover "/api" da URL antes de passar para o backend
      },
    },
  },
})
