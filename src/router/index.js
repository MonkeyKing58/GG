import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/console/:id',
    name: 'Console',
    component: () => import('../views/Console.vue')
  },
  {
    path: '/clients_secret_page',
    name: 'Clients',
    component: () => import('../views/Clients.vue')
  },
  {
    path: '/games/:id',
    name: 'Games',
    component: () => import('../views/Games.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
