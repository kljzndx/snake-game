<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { Point } from "./models/point";
import type { PointOprationCore } from './models/PointOpration';
import { execOpration, ops } from './models/PointOpration';

const width = ref(10)
const height = ref(10)

const bigList = computed(() => {
  const array = new Array<Array<number>>()
  let con = 1
  for (let i = 0; i < height.value; i++) {
    const xList = new Array<number>()
    for (let r = 0; r < width.value; r++) {
      xList.push(con++)
    }
    array.push(xList)
  }
  return array
})

const selected = reactive<number[]>([])
const foodPoint = ref(-1)
const isFalled = ref(false)

function getValue(point: Point): number {
  return bigList.value[point.y][point.x];
}

let lastPoint: Point
let currentPoint: Point
let lastOpration: PointOprationCore = ops.right
let currentOpration: PointOprationCore = ops.right

function setPoint(point: Point): number {
  lastPoint = currentPoint
  currentPoint = point

  const val = getValue(point)
  selected.push(val)
  return val
}

function initGame() {
  foodPoint.value = -1
  isFalled.value = false

  const x = Math.floor((width.value) / 2) - 1
  const y = Math.floor((height.value) / 2)

  for (let i = 0; i < 3; i++) {
    setPoint(new Point(x + i, y))
  }
}

function runGame() {
  function exec(op: PointOprationCore) {
    return execOpration(currentPoint, new Point(width.value - 1, height.value - 1), op)
  }

  let nextPoint = exec(currentOpration)
  if (nextPoint.equals(lastPoint))
    nextPoint = exec(lastOpration)
  else
    lastOpration = currentOpration

  if (selected.includes(getValue(nextPoint))) {
    stopGame()
    isFalled.value = true
    return
  }

  const val = setPoint(nextPoint)
  if (val == foodPoint.value)
    foodPoint.value = -1
  else
    selected.shift()


  if (foodPoint.value == -1) {
    let fall = 0
    do {
      fall++
      const x = Math.floor(Math.random() * width.value)
      const y = Math.floor(Math.random() * height.value)
      foodPoint.value = getValue(new Point(x, y))

      if (selected.includes(foodPoint.value))
        continue

      fall = 0
    } while (selected.includes(foodPoint.value) && fall < 100);
  }
}

let intervalId: number | undefined = undefined

function stopGame() {
  clearInterval(intervalId)
}

function startGame() {
  stopGame()
  selected.splice(0, selected.length)

  initGame()
  intervalId = setInterval(runGame, 1000)
}

function getItemBackground(item: number) {
  const isExisted = selected.includes(item)

  if (isFalled.value && isExisted)
    return 'bg-red-500'
  if (isExisted)
    return 'bg-blue-400'
  if (item == foodPoint.value)
    return 'bg-orange-400'
}

</script>

<template>
  <div>
    <div class="w-min">
      <div v-for="yItem of bigList" class="flex">
        <div v-for="xItem of yItem" class=" w-10 h-10 border-2 border-black" :class="[getItemBackground(xItem)]"></div>
      </div>
    </div>

    <div class=" flex gap-2">
      <button @click="() => startGame()">开始</button>
      <button @click="() => stopGame()">暂停</button>
      <button @click="() => currentOpration = ops.left">左</button>
      <button @click="() => currentOpration = ops.right">右</button>
      <button @click="() => currentOpration = ops.up">上</button>
      <button @click="() => currentOpration = ops.down">下</button>
    </div>
  </div>
</template>

<style scoped>
button {
  @apply p-2 bg-blue-400 hover:bg-blue-300 active:bg-blue-500 rounded-xl
}
</style>
