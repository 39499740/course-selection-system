import {createRouter, createWebHashHistory} from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../pages/dashboard/index.vue'),
    },
    {
      path:'/teachers',
      name:'teachers',
      component: () => import('../pages/teachers/index.vue'),
    },
    {
      path:'/classes',
      name:'classes',
      component: () => import('../pages/classes/index.vue'),
    },
    {
      path:'/settings',
      name:'settings',
      component: () => import('../pages/settings/index.vue'),
    }
  ]
});


export default router;
