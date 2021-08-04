import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import ViteIcons, { ViteIconsResolver } from 'vite-plugin-icons'
import ViteComponents from 'vite-plugin-components'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import PROXY_CONFIG from './proxy.conf'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      pagesDir: [
        { dir: 'src/pages', baseRoute: '' },
        { dir: 'src/areas/account/pages', baseRoute: 'account' }
      ]
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/vite-plugin-components
    ViteComponents({

      dirs: ['src/components', 'src/areas/account/components'],

      // generate `components.d.ts` for ts support with Volar
      globalComponentsDeclaration: true,

      // auto import icons
      customComponentResolvers: [
        // https://github.com/antfu/vite-plugin-icons
        ViteIconsResolver({
          componentPrefix: ''
          // enabledCollections: ['carbon']
        })
      ]
    }),

    // https://github.com/antfu/vite-plugin-icons
    ViteIcons(),

    // https://github.com/intlify/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')]
    })
  ],

  server: {
    fs: {
      strict: true
    },
    proxy: PROXY_CONFIG
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'vuex',
      'vuex-module-decorators',
      'axios',
      'date-fns',
      'vee-validate',
      'yup',
      'jwt-decode'
    ],
    exclude: [
      'vue-demi'
    ]
  }
})
