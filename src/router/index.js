import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MessageView from '../views/MessageView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/msg',
    name: 'msg',
    component: MessageView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
