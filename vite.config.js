import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import expressApp from './api/index.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-plugin',
      configureServer(server) {
        server.middlewares.use(expressApp);
      }
    }
  ],
})
