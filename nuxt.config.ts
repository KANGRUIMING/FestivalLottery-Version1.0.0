// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  plugins: [
    '~/plugins/vue-confetti.client.ts'
  ],
  nitro: {
    preset: 'vercel', // Ensures Nitro is set up for Vercel
    vercel: {
      runtime: 'nodejs18.x' // Forces Vercel to use Node.js 18+
    }
  }
})
