import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import moment from 'moment'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//css
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App);
app.use(store)
app.use(router)
app.use(moment)

app.use(ElementPlus, { size: 'large', zIndex: 3000 ,locale: zhCn,})
// 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
// 去除控制台警告信息
app.config.warnHandler = () => null

app.mount('#app')

// createApp(App).use(store).use(router).mount('#app').config.globalProperties.$http = axios