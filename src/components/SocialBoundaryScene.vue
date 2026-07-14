<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { delay, typeText } from '../utils'
import { useTTS } from '../composables/useTTS'

const emit = defineEmits<{ complete: [] }>()
const { speak, stop: stopTTS } = useTTS()

const socialPhase = ref(0)
const seatDriverActive = ref(false)
const seatPassengerActive = ref(false)
const socialSenseText = ref('')
const socialDialogText = ref('')
const socialDialogDone = ref(false)
const socialShowButtons = ref(false)

onMounted(() => {
  nextTick(() => playSocialPhase1())
})

async function playSocialPhase1() {
  socialPhase.value = 1
  seatDriverActive.value = true
  seatPassengerActive.value = false
  socialSenseText.value = ''
  socialDialogText.value = ''
  socialDialogDone.value = false
  socialShowButtons.value = false

  await delay(700)
  await typeText(socialSenseText, '感知：单人驾驶 · 深夜 · 连续驾驶 3 小时', 35, 65)
  await delay(900)
  await typeText(socialDialogText, '你都开了好久了……要不要在前面服务区歇一会儿？', 110, 170, { onSpeak: speak })
  socialDialogDone.value = true
  await delay(400)
  socialShowButtons.value = true
}

async function onSocialChoice() {
  socialShowButtons.value = false
  await delay(500)
  playSocialPhase2()
}

async function playSocialPhase2() {
  socialPhase.value = 2
  seatPassengerActive.value = true
  socialSenseText.value = ''
  await delay(800)
  await typeText(socialSenseText, '感知：副驾有人上车 · 检测到双人对话', 35, 65)
}

async function onSocialContinue() {
  await delay(300)
  playSocialPhase3()
}

async function playSocialPhase3() {
  socialPhase.value = 3
  seatPassengerActive.value = false
  socialSenseText.value = ''
  socialDialogText.value = ''
  socialDialogDone.value = false
  await delay(800)
  await typeText(socialSenseText, '感知：副驾已下车 · 车内恢复单人', 35, 65)
  await delay(900)
  await typeText(socialDialogText, '刚才有人在，我没说。你今天状态不太好，前面服务区停一下吧。', 100, 160, { onSpeak: speak })
  socialDialogDone.value = true
}

onUnmounted(() => { stopTTS() })
</script>

<template>
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#0a0f1a] to-[#060a12]"></div>
    <div class="absolute inset-0 opacity-[0.025]" style="background-image: linear-gradient(rgba(100,180,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.3) 1px, transparent 1px); background-size: 40px 40px;"></div>
    <div class="relative z-10 w-full h-full flex items-center justify-center px-6 md:px-16 gap-6 md:gap-12">
      <div class="flex-shrink-0" style="width: 320px; max-width: 42vw;">
        <svg viewBox="0 0 600 400" class="w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="seat-glow-g"><feGaussianBlur stdDeviation="8" result="b"/><feFlood flood-color="rgba(34,197,94,0.35)" result="c"/><feComposite in="c" in2="b" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="seat-glow-b"><feGaussianBlur stdDeviation="8" result="b"/><feFlood flood-color="rgba(59,130,246,0.35)" result="c"/><feComposite in="c" in2="b" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <path d="M150,60 Q200,30 300,25 Q400,30 450,60 L470,120 Q480,180 480,200 Q480,280 460,320 L430,360 Q380,385 300,390 Q220,385 170,360 L140,320 Q120,280 120,200 Q120,180 130,120 Z" fill="rgba(15,23,42,0.6)" stroke="rgba(100,180,255,0.15)" stroke-width="1.5"/>
          <path d="M175,75 Q240,50 300,45 Q360,50 425,75" fill="none" stroke="rgba(100,180,255,0.2)" stroke-width="1" stroke-dasharray="4,4"/>
          <path d="M185,345 Q240,365 300,370 Q360,365 415,345" fill="none" stroke="rgba(100,180,255,0.12)" stroke-width="1" stroke-dasharray="4,4"/>
          <rect x="240" y="120" width="120" height="10" rx="3" fill="rgba(30,41,59,0.3)" stroke="rgba(100,180,255,0.06)" stroke-width="0.5"/>
          <rect x="175" y="135" width="55" height="70" rx="8" class="seat-rect" :class="{ 'seat-driver-on': seatDriverActive }"/>
          <text x="202" y="175" text-anchor="middle" :fill="seatDriverActive ? 'rgba(34,197,94,0.7)' : 'rgba(100,180,255,0.2)'" font-size="9" font-family="monospace" style="transition:fill 0.6s ease">DRIVER</text>
          <rect x="370" y="135" width="55" height="70" rx="8" class="seat-rect" :class="{ 'seat-pass-on': seatPassengerActive }" :filter="seatPassengerActive ? 'url(#seat-glow-b)' : 'none'"/>
          <text x="397" y="175" text-anchor="middle" :fill="seatPassengerActive ? 'rgba(59,130,246,0.7)' : 'rgba(100,180,255,0.2)'" font-size="9" font-family="monospace" style="transition:fill 0.6s ease">PASS</text>
          <rect x="185" y="260" width="50" height="60" rx="7" fill="rgba(30,41,59,0.4)" stroke="rgba(100,180,255,0.08)" stroke-width="0.6"/>
          <rect x="365" y="260" width="50" height="60" rx="7" fill="rgba(30,41,59,0.4)" stroke="rgba(100,180,255,0.08)" stroke-width="0.6"/>
          <polygon points="300,248 316,256 316,272 300,280 284,272 284,256" fill="rgba(30,41,59,0.6)" stroke="rgba(100,180,255,0.2)" stroke-width="1"/>
          <text x="300" y="268" text-anchor="middle" fill="rgba(100,180,255,0.4)" font-size="7" font-family="monospace">CUBE</text>
        </svg>
      </div>
      <div class="flex-1 max-w-[420px] min-w-0">
        <div v-if="socialPhase === 1" key="sp1" class="social-phase">
          <div class="sense-output"><span class="sense-prompt">&gt; </span>{{ socialSenseText }}<span v-if="socialSenseText.length > 0 && socialSenseText.length < '感知：单人驾驶 · 深夜 · 连续驾驶 3 小时'.length" class="animate-pulse">|</span></div>
          <div v-if="socialDialogText.length > 0" class="dialog-bubble warm" style="animation: fadeSlideUp 0.6s ease both">
            <div class="dialog-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
            <div class="dialog-body"><p class="dialog-name">车娘</p><p class="dialog-text warm-text">{{ socialDialogText }}<span v-if="!socialDialogDone" class="animate-pulse">|</span></p></div>
          </div>
          <div v-if="socialShowButtons" class="choice-buttons" style="animation: fadeSlideUp 0.5s ease both">
            <button @click="onSocialChoice" class="choice-btn choice-ok">好的</button>
            <button @click="onSocialChoice" class="choice-btn choice-no">不用</button>
          </div>
        </div>
        <div v-if="socialPhase === 2" key="sp2" class="social-phase">
          <div class="sense-output"><span class="sense-prompt">&gt; </span>{{ socialSenseText }}<span v-if="socialSenseText.length > 0 && socialSenseText.length < '感知：副驾有人上车 · 检测到双人对话'.length" class="animate-pulse">|</span></div>
          <div class="dialog-bubble silent" style="animation: fadeSlideUp 0.8s ease 0.3s both">
            <div class="dialog-avatar silent-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
            <div class="dialog-body"><p class="dialog-name silent-name">车娘</p><p class="dialog-text silent-text">（她不说话了。）</p></div>
          </div>
          <div v-if="socialSenseText === '感知：副驾有人上车 · 检测到双人对话'" class="social-annotation" style="animation: fadeSlideUp 0.6s ease 0.8s both">她在有别人时不插话——无论多重要的事。</div>
          <div v-if="socialSenseText === '感知：副驾有人上车 · 检测到双人对话'" class="mt-6" style="animation: fadeSlideUp 0.5s ease 1.2s both"><button @click="onSocialContinue" class="scene-btn">继续 →</button></div>
        </div>
        <div v-if="socialPhase === 3" key="sp3" class="social-phase">
          <div class="sense-output"><span class="sense-prompt">&gt; </span>{{ socialSenseText }}<span v-if="socialSenseText.length > 0 && socialSenseText.length < '感知：副驾已下车 · 车内恢复单人'.length" class="animate-pulse">|</span></div>
          <div v-if="socialDialogText.length > 0" class="dialog-bubble warm" style="animation: fadeSlideUp 0.6s ease both">
            <div class="dialog-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
            <div class="dialog-body"><p class="dialog-name">车娘</p><p class="dialog-text warm-text">{{ socialDialogText }}<span v-if="!socialDialogDone" class="animate-pulse">|</span></p></div>
          </div>
          <div v-if="socialDialogDone" class="social-narration" style="animation: fadeSlideUp 0.8s ease 0.4s both">她不是话痨。她知道什么时候该说，什么时候不该说。</div>
          <div v-if="socialDialogDone" class="mt-8" style="animation: fadeSlideUp 0.6s ease 0.8s both"><button @click="emit('complete')" class="scene-btn">体验下一个展示 →</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.social-phase { animation: socialFadeIn 0.5s ease both; }
@keyframes socialFadeIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
.seat-rect { fill: rgba(30,41,59,0.5); stroke: rgba(100,180,255,0.12); stroke-width: 0.8; transition: fill 0.8s ease, stroke 0.8s ease, stroke-width 0.4s ease; }
.seat-driver-on { fill: rgba(34,197,94,0.25); stroke: rgba(34,197,94,0.6); stroke-width: 1.5; filter: url(#seat-glow-g); }
.seat-pass-on { fill: rgba(59,130,246,0.25); stroke: rgba(59,130,246,0.6); stroke-width: 1.5; }
.sense-output { font-family: monospace; font-size: 12px; color: rgba(100,180,255,0.65); letter-spacing: 0.05em; line-height: 1.6; margin-bottom: 20px; padding: 10px 14px; background: rgba(15,23,42,0.4); border: 1px solid rgba(100,180,255,0.08); border-radius: 4px; }
.sense-prompt { color: rgba(34,211,238,0.5); }
.dialog-bubble { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; opacity: 0; }
.dialog-bubble.silent .dialog-avatar { color: rgba(100,110,130,0.5); }
.dialog-avatar { flex-shrink: 0; color: rgba(34,211,238,0.6); margin-top: 2px; }
.dialog-body { flex: 1; min-width: 0; }
.dialog-name { font-family: monospace; font-size: 10px; letter-spacing: 0.1em; margin-bottom: 6px; color: rgba(34,211,238,0.5); }
.dialog-name.silent-name { color: rgba(100,110,130,0.4); }
.dialog-text { font-size: 14px; line-height: 1.9; color: rgba(200,220,255,0.85); padding: 12px 16px; background: rgba(15,30,55,0.5); border-left: 2px solid rgba(34,211,238,0.4); border-radius: 0 8px 8px 0; backdrop-filter: blur(4px); }
.dialog-text.warm-text { color: rgba(220,235,255,0.9); border-left-color: rgba(34,211,238,0.5); background: rgba(15,30,55,0.6); }
.dialog-text.silent-text { color: rgba(140,150,170,0.55); border-left-color: rgba(100,110,130,0.2); background: rgba(20,24,35,0.35); font-style: italic; }
.choice-buttons { display: flex; gap: 12px; margin-top: 4px; }
.choice-btn { font-family: sans-serif; font-size: 13px; padding: 7px 24px; border-radius: 6px; cursor: pointer; transition: all 0.25s ease; border: 1px solid transparent; }
.choice-ok { color: rgba(34,197,94,0.85); background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.25); }
.choice-ok:hover { background: rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.45); }
.choice-no { color: rgba(148,163,184,0.7); background: rgba(51,65,85,0.3); border-color: rgba(100,116,139,0.2); }
.choice-no:hover { background: rgba(51,65,85,0.5); color: rgba(203,213,225,0.85); }
.social-annotation { font-size: 12px; color: rgba(148,163,184,0.45); font-style: italic; line-height: 1.6; padding-left: 4px; margin-top: 4px; }
.social-narration { font-size: 14px; color: rgba(180,200,220,0.55); text-align: center; letter-spacing: 0.08em; line-height: 2; margin-top: 28px; padding: 16px 0; border-top: 1px solid rgba(100,180,255,0.06); }
</style>