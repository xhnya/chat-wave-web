import Index from "../views/index.vue";


let routers: any[] = [
    { path: '/', component: Index },
    {
        path: '/login',
        component: () => import("../views/user/login.vue"),
    },
    {
        path:'/register',
        component: () => import("../views/user/register.vue")
    }
];

export default routers;