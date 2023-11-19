import { createRouter, createWebHistory } from 'vue-router'
import { validateAuth } from './middlewares'

const routes = [
  {
    path: '/login',
    beforeEnter: validateAuth,
    component: () => import('@/layouts/Blank.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login/Index.vue'),
      },
    ],
  },
  {
    path: '/',
    beforeEnter: validateAuth,
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home/Index.vue'),
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import(/* webpackChunkName: "customers" */ '@/views/Customers/Index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
