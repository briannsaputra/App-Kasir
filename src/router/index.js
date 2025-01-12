import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import OrderView from '@/views/OrderView.vue'
import ProductView from '@/views/ProductView.vue'
import ProductUpdateView from '@/views/ProductUpdateView.vue'
import ProductAddView from '@/views/ProductAddView.vue'
import OrderListView from '@/views/OrderListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView,
    },
    {
      path: '/product/:productId',
      name: 'productUpdate',
      component: ProductUpdateView,
    },
    {
      path: '/product-add',
      name: 'productAdd',
      component: ProductAddView,
    },
    {
      path: '/order-list',
      name: 'order-List',
      component: OrderListView,
    },
  ],
})

export default router
