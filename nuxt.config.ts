export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  plugins: [
    '~/plugins/vue-confetti.client.ts'
  ],
  nitro: {
    preset: 'vercel',
    vercel: {
      runtime: 'nodejs18.x'
    }
  }
})
