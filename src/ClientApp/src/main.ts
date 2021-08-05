// register vue composition api globally
import 'vue-global-api'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { VueModuleContext } from '~/types'

// your custom styles here
import './styles/main.css'

const routes = setupLayouts(generatedRoutes)

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes
})
const head = createHead()

app.use(head)
app.use(router)

const context: VueModuleContext<true> = {
  app,
  head,
  router,
  routes
}

// this loads the modules using Vite's loader
Object.values(import.meta.globEager('./modules/*.ts')).map(i => i.install?.(context))

app.mount('#app')
