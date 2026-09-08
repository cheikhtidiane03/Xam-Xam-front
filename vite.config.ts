import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    // Empeche Vite de basculer silencieusement sur un autre port (5174,
    // 5175...) si 5173 est deja pris - ce qui cassait le CORS cote backend
    // (CORS_ALLOWED_ORIGINS n'autorisait que le port attendu). Avec
    // strictPort, Vite refuse de demarrer plutot que de changer de port
    // sans prevenir, ce qui rend le probleme immediatement visible.
    strictPort: true,
  },
})
