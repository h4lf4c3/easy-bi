import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('../views/Users.vue')
      },
      {
        path: 'datasources',
        name: 'datasources',
        component: () => import('../views/DataSources.vue')
      },
      {
        path: 'datasets',
        name: 'datasets',
        component: () => import('../views/DataSets.vue')
      },
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('../views/Analysis.vue')
      },
      {
        path: 'datasource/create',
        name: 'CreateDataSource',
        component: () => import('../views/DataSource/CreateDataSource.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 设置路由守卫
setupRouterGuard(router)

export default router