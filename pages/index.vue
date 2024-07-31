<template>
  <!-- 导航栏组件，current-page用于表示当前页面 -->
  <Navbar current-page=""></Navbar>
  <div class="flex h-screen bg-center bg-no-repeat bg-cover bg-hero-pattern">
    <!-- <sponsorBanner1></sponsorBanner1> -->
    <div class="absolute top-4 w-screen text-center">
      <!-- 数据加载后显示 -->
      <!--
      <div v-if="data">
        <pre>{{ data }}</pre>
      </div>
      -->
      <!-- 错误信息显示区域 -->
      <div v-if="error">
        <pre>{{ error }}</pre>
      </div>
    </div>
    <main class="m-auto mt-60 w-1/2 min-w-fit overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur bg-white bg-opacity-60">
      <div class="center_column">
        <!-- 数字显示组件 -->
        <DigitDisplay
          class="my-8"
          :target="dispNum1"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd"
        />
        <DigitDisplay
          class="my-8"
          :target="dispNum2"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd"
        />
      </div>
      <div class="center_column">
        <DigitDisplay
          class="my-8"
          :target="dispNum3"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd"
        />
        <!-- 按钮用于触发抽奖 -->
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
      </div>
      <div class="center_column">
        <DigitDisplay
          class="my-8"
          :target="dispNum4"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd"
        />
        <DigitDisplay
          class="my-8"
          :target="dispNum"
          @animation-start="loading = true"
          @animation-end="onAnimationEnd"
        />
      </div>
    </main>
    <!-- <sponsorBanner2></sponsorBanner2> -->
    <!-- 页脚，显示版权信息 -->
    <footer class="absolute bottom-4 w-screen text-center">
      <span class="text-slate-800">&copy; <strong>UTCSSA</strong> - Junyu Yao and Tech Department, 2024.</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 定义状态变量
const data = ref(null)
const error = ref<string | null>(null)
const loading = ref(false) // 通用加载状态

// 页面加载时自动获取数据
onMounted(async () => {
  await fetchData()
})

// 从API获取数据的函数
const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/sheet')
    if (!response.ok) throw new Error('Failed to fetch')
    const jsonData = await response.json()
    data.value = jsonData.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An unexpected error occurred"
  } finally {
    loading.value = false // 确保加载状态设置为false
  }
}

// 向API写入数据的函数
const writeData = async (newData: any[]) => {
  try {
    const response = await fetch('/api/sheet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: newData }), // 根据需要调整数据结构
    })
    if (!response.ok) throw new Error('Failed to write data')
    // 可选地再次获取数据以刷新视图
    await fetchData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : "An unexpected error occurred"
  }
}

// 数字显示组件的目标值引用
const dispNum = ref<number>(0)
const dispNum1 = ref<number>(0)
const dispNum2 = ref<number>(0)
const dispNum3 = ref<number>(0)
const dispNum4 = ref<number>(0)

// 抽取随机数字的函数
const lotterylist = Array.from({length: 310}, (_, i) => i + 1)
const drawNumber = () => {
  const number = lotterylist[Math.floor(Math.random() * lotterylist.length)];
  lotterylist.splice(lotterylist.indexOf(number), 1);
  return number;
}

// 处理抽奖按钮点击的函数
const draw = () => {
  loading.value = true; // 抽奖时设置加载状态为true
  [dispNum, dispNum1, dispNum2, dispNum3, dispNum4].forEach(ref => {
    ref.value = drawNumber();
  });
}

// 彩带动画设置
const confettiSettings = {
  particlesPerFrame: 2,
  defaultDropRate: 15,
  particles: [{ type: 'circle' }, { type: 'heart' }, { type: 'rect' }]
}

// 访问Nuxt应用中的全局属性
const { $confetti } = useNuxtApp().vueApp.config.globalProperties

// 动画结束时的处理函数
const onAnimationEnd = () => {
  loading.value = false; // 动画结束后设置加载状态为false
  $confetti.start(confettiSettings); // 开始彩带动画
  setTimeout(() => {
    $confetti.stop() // 2秒后停止彩带动画
  }, 2000)
}
</script>

<style>
/* 样式定义 */
.column {
  float: left;
  width: 25%;
  padding: 10px;
}
.center_column {
  float: left;
  width: 33.3%;
  padding: 15px;
}
</style>
