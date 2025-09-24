import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import rewriteAll from 'vite-plugin-rewrite-all'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), rewriteAll()],
  build: {
    sourcemap: true, // Enable source maps in production build
  },
})
