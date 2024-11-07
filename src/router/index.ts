import { createMemoryHistory, createRouter } from 'vue-router'
import Index from "../views/index.vue";



const routes = [
    { path: '/', component: Index },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
export default router