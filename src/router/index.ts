import { createMemoryHistory, createRouter } from 'vue-router'
import routers from "./routes.ts";



const routes = routers;

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})
async function isTokenValid(token: any) {
    return !!token;

    // try {
    //     const response = await fetch('/api/validate-token', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //     });
    //     return response.ok;
    // } catch (error) {
    //     console.error('Token validation failed', error);
    //     return false;
    // }
}



router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('chat-wave-access_token');
    if (to.path !== '/login') {
        if (token) {
            const valid = await isTokenValid(token);
            if (valid) {
                next();
            } else {
                localStorage.removeItem('chat-wave-access_token'); // 清除无效 token
                next('/login');
            }
        } else {
            next('/login');
        }
    } else {
        next();
    }
});
export default router