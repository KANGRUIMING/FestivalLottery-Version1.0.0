<template>
  <Navbar current-page="1d" />
  <div class="flex h-screen bg-center bg-no-repeat bg-cover bg-hero-pattern">
    <main
      class="m-auto mt-60 w-1/2 min-w-fit overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur bg-white bg-opacity-60"
    >
      <!-- Two numbers side by side -->
      <div class="flex justify-around items-center py-8">
        <DigitDisplay
          class="mx-4"
          :target="dispNum"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd()"
        />
        <DigitDisplay
          class="mx-4"
          :target="dispNum1"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd()"
        />
      </div>

      <!-- Draw button -->
      <div class="flex justify-center my-8">
        <button
          @click="draw"
          :disabled="loading"
          :class="{
            'bg-gray-300': loading,
            'bg-red-500 hover:bg-red-600 active:bg-red-700 active:shadow-inner shadow-md': !loading,
          }"
          class="text-white text-5xl font-medium rounded-full px-8 py-2 transition-all duration-200 disabled:cursor-wait"
        >
          {{ loading ? 'Loading...' : 'Draw' }}
        </button>
      </div>
    </main>

    <footer class="absolute bottom-4 w-screen text-center">
      <span class="text-slate-800"
        >&copy; <strong>UTCSSA</strong> - Junyu Yao and Tech Department, 2024.</span
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
const { $confetti } = useNuxtApp().vueApp.config.globalProperties

const dispNum = ref<number>(0)
const dispNum1 = ref<number>(0)
const loading = ref<boolean>(false)

// 1 ~ 310
const lotterylist = Array.from({ length: 310 }, (_, i) => i + 1)

// Draws a single random number from lotterylist
const drawNumber = () => {
  const number = lotterylist[Math.floor(Math.random() * lotterylist.length)]
  lotterylist.splice(lotterylist.indexOf(number), 1)
  return number
}

// Draw exactly 2 numbers
const draw = () => {
  [dispNum, dispNum1].forEach(refVar => {
    refVar.value = drawNumber()
  })
}

const confettiSettings = {
  particlesPerFrame: 2,
  defaultDropRate: 15,
  particles: [{ type: 'circle' }, { type: 'heart' }, { type: 'rect' }]
}

const onAnimationEnd = () => {
  loading.value = false
  $confetti.start(confettiSettings)
  setTimeout(() => {
    $confetti.stop()
  }, 2000)
}
</script>

<style scoped>
/* Remove or keep any additional styles you need */
</style>
