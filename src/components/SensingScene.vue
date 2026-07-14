<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { delay, typeText } from '../utils'
import { useTTS } from '../composables/useTTS'

const emit = defineEmits<{ complete: [] }>()
const { speak, stop: stopTTS } = useTTS()

const activeSensor = ref(-1)
const allActivated = ref(false)
const converging = ref(false)
const senseTypedText = ref('')
const showSenseText = ref(false)

interface Sensor {
  id: number; label: string; desc: string; cx: number; cy: number; color: string; glowColor: string
}

const sensors: Sensor[] = [
  { id: 0, label: '驾驶员摄像头', desc: '看你的状态', cx: 300, cy: 55, color: '#3b82f6', glowColor: 'rgba(59,130,246,' },
  { id: 1, label: '广角摄像头', desc: '看车里发生了什么', cx: 300, cy: 130, color: '#22c55e', glowColor: 'rgba(34,197,94,' },
  { id: 2, label: '麦克风阵列', desc: '听谁在说话', cx: 220, cy: 200, color: '#eab308', glowColor: 'rgba(234,179,8,' },
  { id: 3, label: 'IMU', desc: '感受车的运动', cx: 300, cy: 265, color: '#f97316', glowColor: 'rgba(249,115,22,' },
  { id: 4, label: '手机 GPS+地图', desc: '知道你在哪条路', cx: 380, cy: 200, color: '#a855f7', glowColor: 'rgba(168,85,247,' },
]

onMounted(() => {
  nextTick(() => startSensorSequence())
})

async function startSensorSequence() {
  activeSensor.value = -1; allActivated.value = false; converging.value = false
  senseTypedText.value = ''; showSenseText.value = false

  for (let i = 0; i < sensors.length; i++) {
    await delay(500); activeSensor.value = i
  }
  await delay(1200); allActivated.value = true
  await delay(800); converging.value = true
  await delay(1500); showSenseText.value = true
  await typeText(senseTypedText, '她在听。她在看。她在感受。', 100, 160, { onSpeak: speak })
}

onUnmounted(() => { stopTTS() })
</script>

<template>
  <div class="absolute inset-0 flex flex-col items-center justify-center">
    <div class="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#0a0f1a] to-[#060a12]"></div>
    <div class="absolute inset-0 opacity-[0.03]"
         style="background-image: linear-gradient(rgba(100,180,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.3) 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div class="relative z-10" style="width: 440px; max-width: 90vw;">
      <svg viewBox="0 0 600 400" class="w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-blue"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-converge"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d="M150,60 Q200,30 300,25 Q400,30 450,60 L470,120 Q480,180 480,200 Q480,280 460,320 L430,360 Q380,385 300,390 Q220,385 170,360 L140,320 Q120,280 120,200 Q120,180 130,120 Z" fill="rgba(15,23,42,0.6)" stroke="rgba(100,180,255,0.15)" stroke-width="1.5"/>
        <path d="M175,75 Q240,50 300,45 Q360,50 425,75" fill="none" stroke="rgba(100,180,255,0.2)" stroke-width="1" stroke-dasharray="4,4"/>
        <path d="M185,345 Q240,365 300,370 Q360,365 415,345" fill="none" stroke="rgba(100,180,255,0.12)" stroke-width="1" stroke-dasharray="4,4"/>
        <rect x="175" y="135" width="55" height="70" rx="8" fill="rgba(30,41,59,0.5)" stroke="rgba(100,180,255,0.12)" stroke-width="0.8"/>
        <text x="202" y="175" text-anchor="middle" fill="rgba(100,180,255,0.2)" font-size="9" font-family="monospace">DRIVER</text>
        <rect x="370" y="135" width="55" height="70" rx="8" fill="rgba(30,41,59,0.5)" stroke="rgba(100,180,255,0.12)" stroke-width="0.8"/>
        <text x="397" y="175" text-anchor="middle" fill="rgba(100,180,255,0.2)" font-size="9" font-family="monospace">PASS</text>
        <rect x="185" y="260" width="50" height="60" rx="7" fill="rgba(30,41,59,0.4)" stroke="rgba(100,180,255,0.08)" stroke-width="0.6"/>
        <rect x="365" y="260" width="50" height="60" rx="7" fill="rgba(30,41,59,0.4)" stroke="rgba(100,180,255,0.08)" stroke-width="0.6"/>
        <rect x="240" y="120" width="120" height="10" rx="3" fill="rgba(30,41,59,0.3)" stroke="rgba(100,180,255,0.06)" stroke-width="0.5"/>
        <g v-for="(s, idx) in sensors" :key="s.id">
          <circle v-if="activeSensor >= s.id" :cx="s.cx" :cy="s.cy" r="6" :fill="s.glowColor + '0.2)'" :stroke="s.color" stroke-width="1.5" class="sensor-pulse-ring" :style="{ transformOrigin: s.cx + 'px ' + s.cy + 'px' }"/>
          <circle :cx="s.cx" :cy="s.cy" r="5" :fill="activeSensor >= s.id ? s.color : 'rgba(100,180,255,0.15)'" :filter="activeSensor >= s.id ? 'url(#glow-blue)' : 'none'" style="transition: fill 0.5s ease, filter 0.5s ease"/>
          <g :style="{ opacity: activeSensor >= s.id ? 1 : 0.3, transition: 'opacity 0.5s ease' }">
            <template v-if="idx < 2 || idx === 4">
              <text :x="s.cx" :y="s.cy - 16" text-anchor="middle" :fill="s.color" font-size="10" font-family="monospace" font-weight="bold">{{ s.label }}</text>
              <text :x="s.cx" :y="s.cy - 5" text-anchor="middle" fill="rgba(200,220,255,0.5)" font-size="8" font-family="sans-serif">{{ s.desc }}</text>
            </template>
            <template v-else>
              <text :x="s.cx" :y="s.cy + 22" text-anchor="middle" :fill="s.color" font-size="10" font-family="monospace" font-weight="bold">{{ s.label }}</text>
              <text :x="s.cx" :y="s.cy + 33" text-anchor="middle" fill="rgba(200,220,255,0.5)" font-size="8" font-family="sans-serif">{{ s.desc }}</text>
            </template>
          </g>
        </g>
        <g v-if="converging" class="convergence-lines">
          <line x1="300" y1="55" x2="300" y2="265" stroke="rgba(59,130,246,0.4)" stroke-width="1" class="converge-line" style="animation-delay:0s"/>
          <line x1="300" y1="130" x2="300" y2="265" stroke="rgba(34,197,94,0.4)" stroke-width="1" class="converge-line" style="animation-delay:0.1s"/>
          <line x1="220" y1="200" x2="300" y2="265" stroke="rgba(234,179,8,0.4)" stroke-width="1" class="converge-line" style="animation-delay:0.2s"/>
          <line x1="380" y1="200" x2="300" y2="265" stroke="rgba(168,85,247,0.4)" stroke-width="1" class="converge-line" style="animation-delay:0.3s"/>
        </g>
        <g :class="{ 'cube-converge': converging }">
          <polygon points="300,248 316,256 316,272 300,280 284,272 284,256" :fill="converging ? 'rgba(0,200,255,0.15)' : 'rgba(30,41,59,0.6)'" :stroke="converging ? 'rgba(0,200,255,0.6)' : 'rgba(100,180,255,0.2)'" stroke-width="1" style="transition:all 0.8s ease"/>
          <text x="300" y="268" text-anchor="middle" fill="rgba(100,180,255,0.5)" font-size="7" font-family="monospace" :style="{ opacity: converging ? 0 : 0.5, transition: 'opacity 0.5s' }">CUBE</text>
        </g>
        <circle v-if="converging" cx="300" cy="265" r="15" fill="rgba(0,200,255,0.08)" filter="url(#glow-converge)" class="converge-glow"/>
        <circle v-if="converging" cx="300" cy="265" r="10" fill="rgba(0,200,255,0.15)" class="converge-glow-inner"/>
      </svg>
    </div>
    <div v-if="showSenseText" class="relative z-20 mt-6 text-center" style="animation: fadeSlideUp 1s ease both">
      <p class="font-mono text-sm md:text-base tracking-widest" style="color: rgba(140,210,255,0.85);">
        {{ senseTypedText }}<span v-if="senseTypedText.length < '她在听。她在看。她在感受。'.length" class="animate-pulse">|</span>
      </p>
    </div>
    <div v-if="showSenseText && senseTypedText === '她在听。她在看。她在感受。'" class="relative z-20 mt-10" style="animation: fadeSlideUp 0.8s ease 0.3s both">
      <button @click="emit('complete')" class="scene-btn">感受下一个场景 →</button>
    </div>
  </div>
</template>

<style scoped>
.sensor-pulse-ring { animation: sensorPulseScale 1.2s ease-out forwards; }
@keyframes sensorPulseScale { 0% { transform: scale(1); opacity: 0.8; stroke-width: 1.5; } 100% { transform: scale(6); opacity: 0; stroke-width: 0.2; } }
.convergence-lines .converge-line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 1s ease forwards; }
@keyframes drawLine { to { stroke-dashoffset: 0; } }
.converge-glow { animation: convergeGlow 1.5s ease-in-out infinite; transform-origin: 300px 265px; }
@keyframes convergeGlow { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.5); opacity: 1; } }
.converge-glow-inner { animation: convergeGlowInner 1.5s ease-in-out infinite; }
@keyframes convergeGlowInner { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.cube-converge { animation: cubePulse 2s ease-in-out infinite; }
@keyframes cubePulse { 0%, 100% { filter: drop-shadow(0 0 8px rgba(0,200,255,0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(0,200,255,0.6)); } }
</style>