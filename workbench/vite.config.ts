import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const dir = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  root: dir('.'),
  plugins: [react(), tailwindcss()],
  server: { port: 6006, open: false },
  build: {
    outDir: dir('../gallery-dist'),
    emptyOutDir: true,
    rollupOptions: { input: { index: dir('index.html'), preview: dir('preview.html') } },
  },
})
