import type { App } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import type { HeadClient } from '@vueuse/head'

export interface VueModuleContext<HasRouter extends boolean = true> {
  app: App<Element>
  router: HasRouter extends true ? Router : undefined
  routes: HasRouter extends true ? RouteRecordRaw[] : undefined
  head: HeadClient | undefined
}

export type UserModule = (ctx: VueModuleContext) => void
