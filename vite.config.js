import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gustaveaam/', // Update this to match your repository name unless it's your root domain (e.g., Pulgustave.github.io)
})
