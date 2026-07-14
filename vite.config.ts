import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/carniang/',
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api/tts': {
        target: 'https://openspeech.bytedance.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, '/api/v1/tts'),
      },
    },
  },
})
