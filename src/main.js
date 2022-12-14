import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import moment from 'moment/moment'
// import axios from 'axios'

const app = createApp(App);
app.use(store)
app.use(router)
app.use(moment)
app.use(ElementPlus, { size: 'large', zIndex: 3000 })
app.mount('#app')

// createApp(App).use(store).use(router).mount('#app').config.globalProperties.$http = axios