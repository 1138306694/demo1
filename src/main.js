import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

document.write('Hello Webpack Ts')

createApp(App).use(store).use(router).mount('#app')
