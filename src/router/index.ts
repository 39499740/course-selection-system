import {createRouter, createWebHashHistory} from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: () => import('../pages/home/index.vue'),
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('../pages/home/dashboard/index.vue'),
                },
                {
                    path: '/teachers',
                    name: 'teachers',
                    component: () => import('../pages/home/teachers/index.vue'),
                },
                {
                    path: '/classes',
                    name: 'classes',
                    component: () => import('../pages/home/classes/index.vue'),
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('../pages/home/settings/index.vue'),
                },
            ]
        },
        {
            path: '/newSession',
            name: 'newSession',
            component: () => import('../pages/newSession/index.vue'),
        }

    ]
});


export default router;
