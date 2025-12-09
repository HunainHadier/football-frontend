//import { defineConfig } from 'vite'
//import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//export default defineConfig({
 // plugins: [react()],
  //resolve: {
    //alias: {
      //'@/components': '/src/components',
      //'@/utils': '/src/utils',
      //'@/hooks': '/src/hooks',
    //},
  //},
//})



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': '/src/components',
      '@/utils': '/src/utils',
      '@/hooks': '/src/hooks',
    },
  },
  server: {
    host: true, // allow external access
    port: 5173,
    strictPort: true,
    allowedHosts: ['sportsassessor.com', 'localhost', '127.0.0.1'],
  }
})
