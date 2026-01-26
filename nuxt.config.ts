import pkg from './package.json';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: ['@nuxthub/core', '@clerk/nuxt', '@pinia/nuxt', '@pinia/colada-nuxt', '@nuxt/ui'],
  hub: {
    database: true,
  },
  colorMode: {
    preference: 'dark',
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: [],
      ignore: ['/api/**', '/'],
      failOnError: false,
    },
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'https://habitly-vue.vercel.app',
    },
  },
});
