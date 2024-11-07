import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')
