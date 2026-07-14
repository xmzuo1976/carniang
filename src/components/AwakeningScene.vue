<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { delay, typeText } from '../utils'
import { useTTS } from '../composables/useTTS'
import CubeElement from './CubeElement.vue'
import GirlSilhouette from './GirlSilhouette.vue'

const emit = defineEmits<{ complete: [] }>()
const { speak, stop: stopTTS } = useTTS()
const ttsOpts = { onSpeak: speak }

const phase = ref<'idle' | 'dragging' | 'awakening' | 'speaking'>('idle')
const cubeY = ref(0)
const cubeOpacity = ref(1)
const cubeGlow = ref(0)
const showVeins = ref(false)
const showGirl = ref(false)
const girlOpacity = ref(0)
const eyeOpen = ref(false)
const blinkState = ref<'closed' | 'opening' | 'open' | 'blinking' | 'tilt'>('closed')
const typedText = ref('')
const currentLine = ref(0)
const showText = ref(false)
const showSlot = ref(true)
const isDragging = ref(false)
const dragOffset = ref(0)

const lines = ['……我醒了。', '你在看我？']

const slotEl = ref<HTMLElement | null>(null)
const cubeEl = ref<HTMLElement | null>(null)

onMounted(() => {
  // nothing, user interaction triggers
})

function onCubePointerDown(e: PointerEvent) {
  if (phase.value !== 'idle') return
  isDragging.value = true
  const rect = (cubeEl.value as HTMLElement).getBoundingClientRect()
  dragOffset.value = e.clientY - rect.top
  ;(cubeEl.value as HTMLElement).setPointerCapture(e.pointerId)
}

function onCubePointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const slotRect = (slotEl.value as HTMLElement).getBoundingClientRect()
  const slotCenterY = slotRect.top + slotRect.height / 2
  const cubeCenterY = e.clientY - dragOffset.value + 30
  const diff = slotCenterY - cubeCenterY
  cubeY.value = Math.max(0, Math.min(diff, 0))
  if (diff <= 5) { phase.value = 'dragging' } else { phase.value = 'idle' }
}

function onCubePointerUp() {
  if (!isDragging.value) return
  isDragging.value = false
  if (phase.value === 'dragging') startAwakening()
}

function onClickSlot() {
  if (phase.value === 'idle') startAwakening()
}

async function startAwakening() {
  phase.value = 'awakening'
  cubeY.value = 0
  showSlot.value = false

  await delay(300); cubeGlow.value = 1
  await delay(1000); showVeins.value = true
  await delay(1500); showGirl.value = true; await delay(100); girlOpacity.value = 1
  await delay(1200); eyeOpen.value = true; blinkState.value = 'opening'; await delay(600); blinkState.value = 'open'
  await delay(800); blinkState.value = 'blinking'; await delay(200); blinkState.value = 'open'
  await delay(600); showText.value = true; await typeText(typedText, lines[0], 100, 160, ttsOpts)
  await delay(800); phase.value = 'speaking'; blinkState.value = 'tilt'; await delay(400); await typeText(typedText, lines[1], 100, 160, ttsOpts)
}

onUnmounted(() => { stopTTS() })
</script>

<template>
  <div class="absolute inset-0">
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1220] to-[#111827]"></div>
      <div class="absolute bottom-[35%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-900/20 to-transparent"></div>
      <div class="absolute bottom-[33%] left-[15%] w-1 h-1 rounded-full bg-amber-500/30 animate-pulse"></div>
      <div class="absolute bottom-[34%] left-[35%] w-0.5 h-0.5 rounded-full bg-amber-400/25 animate-pulse" style="animation-delay:0.5s"></div>
      <div class="absolute bottom-[33%] left-[55%] w-1 h-1 rounded-full bg-orange-400/20 animate-pulse" style="animation-delay:1.2s"></div>
      <div class="absolute bottom-[34%] left-[72%] w-0.5 h-0.5 rounded-full bg-amber-300/20 animate-pulse" style="animation-delay:0.8s"></div>
      <div class="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-b from-[#0f1520] to-[#0a0e18]"></div>
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-[30%]"
           style="background: repeating-linear-gradient(to bottom, transparent, transparent 20px, rgba(255,255,255,0.04) 20px, rgba(255,255,255,0.04) 40px)"></div>
    </div>

    <div class="absolute inset-0 z-10 pointer-events-none">
      <div class="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-[#0c1018] via-[#0c1018]/95 to-transparent"></div>
      <div class="absolute bottom-[22%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent"></div>
      <div class="absolute top-0 left-0 w-[8%] h-full bg-gradient-to-r from-[#080c14] to-transparent"></div>
      <div class="absolute top-0 right-0 w-[8%] h-full bg-gradient-to-l from-[#080c14] to-transparent"></div>
      <div class="absolute top-[8%] left-1/2 -translate-x-1/2 w-[12%] h-[3%] bg-[#0a0e16]/80 rounded-full border border-white/[0.04]"></div>
    </div>

    <div v-if="showVeins" class="absolute inset-0 z-20 pointer-events-none windshield-veins"></div>

    <div v-if="showGirl" class="absolute z-30 pointer-events-none"
         :style="{ opacity: girlOpacity, transition: 'opacity 1.5s ease' }">
      <GirlSilhouette :opacity="girlOpacity" :eye-open="eyeOpen" :blinking="blinkState === 'blinking'" :tilt="blinkState === 'tilt'" />
    </div>

    <div class="absolute z-40 transition-all duration-700 ease-out"
         :style="{ bottom: showSlot ? 'calc(22% + 20px)' : '22%', left: '50%', transform: `translateX(-50%) translateY(${cubeY}px)`, opacity: cubeOpacity }"
         ref="cubeEl"
         @pointerdown="onCubePointerDown" @pointermove="onCubePointerMove" @pointerup="onCubePointerUp"
         :class="{ 'cursor-grab': phase === 'idle', 'cursor-grabbing': isDragging, 'pointer-events-none': phase !== 'idle' }">
      <CubeElement :glow="cubeGlow > 0" :opacity="cubeOpacity" />
    </div>

    <div v-if="showSlot" class="absolute z-35"
         :style="{ bottom: 'calc(22% - 10px)', left: '50%', transform: 'translateX(-50%)' }"
         ref="slotEl"
         @click="onClickSlot">
      <div class="obd-slot cursor-pointer" :class="{ 'obd-highlight': phase === 'dragging' }">
        <div class="obd-inner"></div>
        <div class="obd-label font-mono text-[9px] tracking-wider text-white/20 uppercase">OBD-II</div>
      </div>
    </div>

    <div v-if="showText" class="absolute z-50 pointer-events-none"
         :style="{ bottom: 'calc(22% + 140px)', left: '50%', transform: 'translateX(-50%)' }">
      <div class="text-center">
        <p class="font-mono text-sm md:text-base tracking-wide" style="color: rgba(140, 210, 255, 0.85);">
          {{ typedText }}<span v-if="typedText.length < lines[currentLine]?.length" class="animate-pulse">|</span>
        </p>
      </div>
    </div>

    <div v-if="phase === 'speaking' && typedText === lines[1]"
         class="absolute bottom-[5%] left-1/2 -translate-x-1/2 z-50"
         style="animation: fadeSlideUp 0.8s ease 0.5s both">
      <button @click="emit('complete')" class="scene-btn">感知下一个场景 →</button>
    </div>
  </div>
</template>

<style scoped>
.windshield-veins { background: radial-gradient(ellipse at 50% 40%, rgba(0,180,255,0.06) 0%, transparent 70%); animation: veinAppear 2s ease-out forwards; }
@keyframes veinAppear { 0% { opacity: 0; } 100% { opacity: 1; } }
.obd-slot { width: 120px; height: 16px; background: linear-gradient(to right, #0a0e16, #151b28, #0a0e16); border: 1px solid rgba(100,180,255,0.1); border-radius: 3px; display: flex; align-items: center; justify-content: center; position: relative; transition: border-color 0.3s, box-shadow 0.3s; }
.obd-slot:hover { border-color: rgba(100,180,255,0.25); }
.obd-highlight { border-color: rgba(0,200,255,0.4) !important; box-shadow: 0 0 15px rgba(0,200,255,0.1), inset 0 0 10px rgba(0,200,255,0.05); }
.obd-inner { width: 80%; height: 4px; background: linear-gradient(to right, transparent, rgba(100,180,255,0.08), transparent); border-radius: 2px; }
.z-35 { z-index: 35; }
</style>