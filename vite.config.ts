import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        Vuetify({
            autoImport: true,
            styles: {
                configFile: 'src/styles/settings.scss',
            },
        }), // 这里直接引入 vuetify/vite
    ],
    resolve: {
        alias: {
            // 将 'path' 映射到 'path-browserify'
            // path: path.resolve(__dirname, 'node_modules', 'path-browserify'), // 修改这里
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimizeDeps: {
        exclude: ['vuetify'],
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: 'modern-compiler',
            },
            scss: {
                api: 'modern-compiler',
            },
        },
    },

})
