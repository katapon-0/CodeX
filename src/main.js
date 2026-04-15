import { createApp } from 'vue'
import './style.css'
import './styleAdaptive.css' 

import App from './App.vue'

import {router} from './route'

createApp(App).use(router).mount('#app')
router.afterEach((to) => {
  document.title = to.meta.title || 'CODEX'
})