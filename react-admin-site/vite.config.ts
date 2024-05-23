import { defineConfig } from 'vite'
import Pages from 'vite-plugin-pages'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), Pages()],
  resolve: {}
})
