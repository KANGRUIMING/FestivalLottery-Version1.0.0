export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  plugins: [
    '~/plugins/vue-confetti.client.ts'
  ],
  nitro: {
    preset: 'vercel', // Ensures Nitro is set up for Vercel
    runtime: 'nodejs18.x' // Explicitly sets the correct runtime
  }
})
