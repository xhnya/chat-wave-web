import Index from "../views/index.vue";


let routers: any[] = [
    { path: '/', component: Index },
    {
        path: '/login',
        component: () => import("../views/user/login.vue"),
    },
];

export default routers;