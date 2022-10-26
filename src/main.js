import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import axios from "axios";

document.write('Hello Webpack Ts')

createApp(App).use(store).use(router).mount('#app').use(axios)
