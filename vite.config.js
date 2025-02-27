import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 5173,
    allowedHosts: [
      'the-works-of-joe-johnson-2c33aa058b4b.herokuapp.com',
      '.herokuapp.com'  // This allows all Heroku domains
    ]
  }
})
