import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 将 'path' 映射到 'path-browserify'
      path: path.resolve(__dirname, 'node_modules', 'path-browserify'), // 修改这里
      '@': path.resolve(__dirname, 'src')
    }
  }
})
