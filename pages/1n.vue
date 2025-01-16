<template>
  <!-- 导航栏组件，current-page用于表示当前页面 -->
  <Navbar current-page="1n" />
  <div class="flex h-screen bg-center bg-no-repeat bg-cover bg-hero-pattern">
    <main
      class="m-auto mt-60 w-1/2 min-w-fit overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur bg-white bg-opacity-60"
    >
      <!-- 
        A 3-column flex layout:
          - Left column: 2 numbers
          - Middle column: Draw button
          - Right column: 2 numbers
      -->
      <div class="flex justify-around items-start py-8">
        <!-- Left side: 2 numbers stacked -->
        <div class="flex flex-col items-center space-y-8">
          <DigitDisplay
            :target="dispNum1"
            @animation-start="loading = true"
            @animation-end="onAnimationEnd"
          />
          <DigitDisplay
            :target="dispNum2"
            @animation-start="loading = true"
            @animation-end="onAnimationEnd"
          />
        </div>

        <!-- Center: Draw button -->
        <div class="flex flex-col items-center space-y-8">
          <button
            @click="draw"
            :disabled="loading"
            :class="{
              'bg-gray-300': loading,
              'bg-red-500 hover:bg-red-600 active:bg-red-700 active:shadow-inner shadow-md': !loading
            }"
            class="text-white text-5xl font-medium rounded-full px-8 py-2 transition-all duration-200 disabled:cursor-wait"
          >
            {{ loading ? 'Loading...' : 'Draw' }}
          </button>
        </div>

        <!-- Right side: 2 numbers stacked -->
        <div class="flex flex-col items-center space-y-8">
          <DigitDisplay
            :target="dispNum3"
            @animation-start="loading = true"
            @animation-end="onAnimationEnd"
          />
          <DigitDisplay
            :target="dispNum4"
            @animation-start="loading = true"
            @animation-end="onAnimationEnd"
          />
        </div>
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
import { ref, onMounted } from 'vue'

// Optional: data fetching/error (if you need to fetch sheet data)
const data = ref(null)
const error = ref<string | null>(null)
const loading = ref(false)

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const response = await fetch('/api/sheet')
    if (!response.ok) throw new Error('Failed to fetch')
    const jsonData = await response.json()
    data.value = jsonData.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An unexpected error occurred"
  } finally {
    loading.value = false
  }
}

async function writeData(newData: any[]) {
  try {
    const response = await fetch('/api/sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: newData })
    })
    if (!response.ok) throw new Error('Failed to write data')
    // Refresh data
    await fetchData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An unexpected error occurred"
  }
}

// Lottery logic
const dispNum1 = ref<number>(0)
const dispNum2 = ref<number>(0)
const dispNum3 = ref<number>(0)
const dispNum4 = ref<number>(0)

const lotterylist = Array.from({ length: 310 }, (_, i) => i + 1)

function drawNumber() {
  const number = lotterylist[Math.floor(Math.random() * lotterylist.length)]
  lotterylist.splice(lotterylist.indexOf(number), 1)
  return number
}

function draw() {
  loading.value = true
  ;[dispNum1, dispNum2, dispNum3, dispNum4].forEach(refVar => {
    refVar.value = drawNumber()
  })
}

// Confetti
const confettiSettings = {
  particlesPerFrame: 2,
  defaultDropRate: 15,
  particles: [{ type: 'circle' }, { type: 'heart' }, { type: 'rect' }]
}

const { $confetti } = useNuxtApp().vueApp.config.globalProperties

function onAnimationEnd() {
  loading.value = false
  $confetti.start(confettiSettings)
  setTimeout(() => {
    $confetti.stop()
  }, 2000)
}
</script>

<style scoped>
/* Tailwind & utility classes used in <template>.
   Add or remove custom styles if necessary. */
</style>
