import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Config de Vite. Si despliegas en una subcarpeta de tu server
// (ej: midominio.com/tarjetas/), cambia "base" a esa ruta, ej: '/tarjetas/'.
// El proxy de /api solo se usa en desarrollo local (npm run dev): así el
// cliente (puerto 5173) le habla al servidor Express sin problemas de CORS.
// En producción, Express sirve todo desde el mismo origen.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
