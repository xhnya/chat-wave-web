import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    global : 'window'
  },
  server: {
    proxy: {
      '/ws': {
        target: 'http://localhost:9000', // 后端服务器地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, '/ws'), // 可选：根据需要重写路径
      },
    },
  },
})
