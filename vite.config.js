import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('jspdf')) {
              return 'vendor-jspdf';
            }
            if (id.includes('html2canvas')) {
              return 'vendor-html2canvas';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-recharts';
            }
            if (id.includes('swiper')) {
              return 'vendor-swiper';
            }
            if (id.includes('reactstrap') || id.includes('bootstrap')) {
              return 'vendor-reactstrap';
            }
            if (id.includes('styled-components')) {
              return 'vendor-styled';
            }
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react-core';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})