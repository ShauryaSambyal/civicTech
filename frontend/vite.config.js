import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // The Firebase configuration lives with the backend, not the frontend:
  // `backend/.env` (gitignored) and `backend/.env.example` (committed).
  // This tells Vite where to read env files from, so the browser bundle
  // still receives the VITE_* values it needs.
  envDir: fileURLToPath(new URL('../backend', import.meta.url)),
})
