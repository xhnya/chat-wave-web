import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

// 引入 Vuetify 核心
import { createVuetify } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
const vuetify = createVuetify()






const pinia = createPinia()
pinia.use(piniaPersist)

createApp(App)
    .use(router)
    .use(pinia)
    .use(ElementPlus)
    .use(vuetify)
    .mount('#app')
