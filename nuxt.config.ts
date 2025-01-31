// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  plugins: [
    '~/plugins/vue-confetti.client.ts'
  ],
  nitro: {
    nodeVersion: '18' // Add this Nitro configuration
  }
})