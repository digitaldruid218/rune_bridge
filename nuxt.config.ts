// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],

  runtimeConfig: {
    secret: '',
    public: {
    },
    private: {
      MONGODB_URL: process.env.NUXT_PRIVATE_MONGODB_ADDRESS,
      OK_API_KEY: process.env.NUXT_PRIVATE_OK_API_KEY,
      OK_SECRET_KEY: process.env.NUXT_PRIVATE_OK_SECRET_KEY,
      OK_PASSPHRASE: process.env.NUXT_PRIVATE_OK_PASSPHRASE,
    }
  },

  devtools: { enabled: true },

  nitro: {
    plugins: ["~/server/index.ts"],
  },

  // mongoose: {
  //   uri: process.env.NUXT_PRIVATE_MONGODB_ADDRESS,
  //   options: {},
  //   modelsDir: 'models',
  // },
  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    }
  },
  // plugins: [
  //   { src: '~/plugins/vue3-datepicker', mode: 'client' } // 클라이언트 사이드에서만 로드되도록 설정
  // ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  routeRules: {
    '/test_api/**': {
      proxy: { to: "https://testnet.bisonlabs.io/**", },
    },
    '/main_api/**': {
      proxy: { to: "https://app.bisonlabs.io/**", },
    }
  }
})
