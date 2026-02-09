import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',   // 👈 VERY IMPORTANT
  plugins: [react()],
})
