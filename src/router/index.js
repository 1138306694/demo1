import { createRouter, createWebHashHistory } from 'vue-router'
import LittleTool from '@/views/LittleTool.vue'
import MessageView from '@/views/MessageView.vue'
import HomeView from '@/views/HomeView.vue'

import WorkTeamVue from '../components/work/WorkTeam.vue'
import WorkSubject from '@/components/work/WorkSubject.vue'
import WorkClass from '@/components/work/WorkClass.vue'
import WorkCourse from '@/components/work/WorkCourse.vue'
import WorkStuClass from '@/components/work/WorkStuClass.vue'
import WorkStu from '@/components/work/WorkStu.vue'
import WorkExam from '@/components/work/WorkExam.vue'
import WorkRecord from '@/components/work/WorkRecord.vue'



const routes = [

  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
    },
    children: [
      {
        path: '/tool',
        name: 'littleTool',
        component: LittleTool,
        meta: {
        }
      },
       {   
        path: '/wechat/msg',
        name: 'wechatMsg',
        component: MessageView,
      meta: {
      }
      },
      {   
        path: '/work/term',
        name: 'workTerm',
        component: WorkTeamVue,
      meta: {
      }
      },
      {   
        path: '/work/subject',
        name: 'workSubject',
        component: WorkSubject,
      meta: {
      }
      },
      {   
        path: '/work/class',
        name: 'workClass',
        component: WorkClass
      },
      {   
        path: '/work/course',
        name: 'workCourse',
        component: WorkCourse
      },
      {   
        path: '/work/stu/class',
        name: 'workStuClass',
        component: WorkStuClass
      },
      {   
        path: '/work/stu',
        name: 'workStu',
        component: WorkStu
      },
      {   
        path: '/work/exam',
        name: 'workExam',
        component: WorkExam
      },
      {   
        path: '/work/record',
        name: 'workRecord',
        component: WorkRecord
      },
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
