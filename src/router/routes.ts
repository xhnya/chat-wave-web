import Index from "../views/index.vue";


let routers: any[] = [
    {
        path: '/',
        component: Index,
        redirect: '/chat',
        children: [
            {
                path: 'chat',
                component: () => import("@/views/chat/index.vue"),
            },
            {
                path: 'contacts',
                component: () => import("@/views/contacts/index.vue"),
            }
        ]
    },
    {
        path: '/login',
        component: () => import("../views/user/login.vue"),
    },
    {
        path: '/register',
        component: () => import("../views/user/register.vue")
    }
];

export default routers;