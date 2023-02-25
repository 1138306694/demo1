import { createRouter, createWebHashHistory } from 'vue-router'
import LittleTool from '@/views/LittleTool.vue'
import MessageView from '@/views/MessageView.vue'
import HomeView from '@/views/HomeView.vue'

const routes = [

  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      keepAlive: true,
    },
    children: [
      {
        path: '/tool',
        name: 'littleTool',
        component: LittleTool,
        meta: {
          keepAlive: true,
        }
      },
       {   
        path: '/wechat/msg',
        name: 'wechatMsg',
        component: MessageView,
      meta: {
        keepAlive: true,
      }
      },
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
