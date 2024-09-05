<template>
  <Navbar current-page="1d"></Navbar>
  <div class="flex h-screen bg-center bg-no-repeat bg-cover bg-hero-pattern">
    <main class="m-auto w-1/2 min-w-fit overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur bg-white bg-opacity-60">
      <DigitDisplaydigit
        class="my-8"
        :target="dispNum"
        :digit="digitNum"
        @animation-start="loading = true"
        @animation-end="onAnimationEnd()"
        @animation-update="loading = false"
      />
      <div class="flex justify-center my-8">
        <button
          @click="draw()"
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
      <span class="text-slate-800">&copy; <strong>UTCSSA</strong> Junyu Yao and Tech Department, 2024.</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const { $confetti } = useNuxtApp().vueApp.config.globalProperties;
const dispNum = ref<number>(0);
const digitNum = ref<number>(2);
const loading = ref<boolean>(false);
const lotterylist = ref<number[]>([]); // Use ref to store fetched data

// Fetch data from your backend API
const loadData = async () => {
  try {
    const response = await fetch('/api/sheet'); // Update to the correct API route
    const result = await response.json();
    lotterylist.value = result.data.map((row: string[]) => Number(row[0])); // Assuming each row has a number in column J
  } catch (error) {
    console.error('Error fetching lottery numbers:', error);
  }
};

// Call loadData when the component is mounted
onMounted(loadData);

const draw = () => {
  if (digitNum.value === 2) {
    console.log('end');
    digitNum.value = 0;
    dispNum.value = lotterylist.value[Math.floor(Math.random() * lotterylist.value.length)];
    lotterylist.value.splice(lotterylist.value.indexOf(dispNum.value), 1);
    console.log(dispNum.value);
  } else {
    console.log('next');
    digitNum.value += 1;
  }
};

const onAnimationEnd = () => {
  loading.value = false;
  $confetti.start({
    particlesPerFrame: 2,
    defaultDropRate: 15,
    particles: [
      { type: 'circle' },
      { type: 'heart' },
      { type: 'rect' },
    ]
  });
  setTimeout(() => {
    $confetti.stop();
  }, 2000);
};
</script>

<style>
.column {
  float: left;
  width: 25%;
  padding: 20px;
}
</style>
