<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { delay, typeText } from '../utils'
import { useTTS } from '../composables/useTTS'

const emit = defineEmits<{ complete: [] }>()
const { speak, stop: stopTTS } = useTTS()

const memPhase = ref(0)
const memQuestionText = ref('')
const memQuestionDone = ref(false)
const memShowInput = ref(false)
const memUserInput = ref('')
const memUserSubmitted = ref('')
const memReplyText = ref('')
const memReplyDone = ref(false)
const memTransitionText = ref('')
const memRecallText = ref('')
const memRecallDone = ref(false)
const memAnnotation = ref(false)
const finaleVisible = ref(0)
const memInputEl = ref<HTMLInputElement | null>(null)

onMounted(() => {
  nextTick(() => playMemoryPhase1())
})

async function playMemoryPhase1() {
  memPhase.value = 1
  memQuestionText.value = ''
  memQuestionDone.value = false
  memShowInput.value = false
  memUserInput.value = ''
  memUserSubmitted.value = ''
  memReplyText.value = ''
  memReplyDone.value = false
  memTransitionText.value = ''
  memRecallText.value = ''
  memRecallDone.value = false
  memAnnotation.value = false
  finaleVisible.value = 0

  await delay(800)
  await typeText(memQuestionText, '你饿不饿？刚才路过一家面馆，看着挺香的。', 90, 140, { onSpeak: speak })
  memQuestionDone.value = true
  await delay(300)
  memShowInput.value = true
  await nextTick()
  memInputEl.value?.focus()
}

function onMemorySubmit() {
  if (!memUserInput.value.trim()) return
  memUserSubmitted.value = memUserInput.value.trim()
  memShowInput.value = false
  playMemoryPhase2()
}

async function playMemoryPhase2() {
  memPhase.value = 2
  await delay(600)
  await typeText(memReplyText, '好，我记住了。', 120, 180, { onSpeak: speak })
  memReplyDone.value = true
  await delay(1500)
  playMemoryTransition()
}

async function playMemoryTransition() {
  memPhase.value = 3
  await delay(400)
  await typeText(memTransitionText, '两个月后，同一条路……', 60, 100)
  await delay(2000)
  playMemoryRecall()
}

async function playMemoryRecall() {
  memPhase.value = 4
  memRecallText.value = ''
  await delay(500)
  const recallLine = '诶，前面就是那家面馆。你上次说' + (memUserSubmitted.value || '牛肉面不错') + '——要不要拐过去？'
  await typeText(memRecallText, recallLine, 90, 150, { onSpeak: speak })
  memRecallDone.value = true
  await delay(1200)
  memAnnotation.value = true
  await delay(2000)
  playFinale()
}

async function playFinale() {
  memPhase.value = 5
  const finaleLines = ['感谢体验车娘 CarNiang', '你的车，活过来了。', '你换车，不换娘。']
  for (let i = 0; i < finaleLines.length; i++) {
    finaleVisible.value = i + 1
    await speak(finaleLines[i])
    await delay(1200)
  }
}

onUnmounted(() => { stopTTS() })
</script>

<template>
  <div class="absolute inset-0">
    <div class="absolute inset-0 bg-gradient-to-b from-[#060a12] via-[#0a0f1a] to-[#080c16]"></div>
    <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(100,180,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,180,255,0.3) 1px, transparent 1px); background-size: 40px 40px;"></div>

    <div v-if="memPhase >= 3 && memPhase < 5"
         class="absolute inset-0 z-20 pointer-events-none transition-opacity duration-1000"
         :class="{ 'mem-fade-overlay': memPhase === 3 }">
    </div>

    <div class="relative z-10 w-full h-full flex flex-col items-center justify-center px-6">

      <div v-if="memPhase >= 1 && memPhase <= 2" class="w-full max-w-lg mem-phase-in">
        <div class="dialog-bubble warm" :style="{ animation: memQuestionDone ? 'none' : 'fadeSlideUp 0.6s ease both', opacity: memQuestionDone ? 1 : undefined }">
          <div class="dialog-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
          <div class="dialog-body">
            <p class="dialog-name">车娘</p>
            <p class="dialog-text warm-text">{{ memQuestionText }}<span v-if="!memQuestionDone" class="animate-pulse">|</span></p>
          </div>
        </div>

        <div v-if="memShowInput" class="mem-input-area" style="animation: fadeSlideUp 0.4s ease both">
          <div class="mem-input-wrap">
            <input ref="memInputEl"
                   v-model="memUserInput"
                   type="text"
                   placeholder="说点什么……"
                   maxlength="50"
                   @keydown.enter="onMemorySubmit"
                   class="mem-input" />
            <button @click="onMemorySubmit" class="mem-send-btn" :class="{ 'mem-send-active': memUserInput.trim().length > 0 }">
              <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>

        <div v-if="memUserSubmitted && memPhase === 2" class="dialog-bubble user-bubble" style="animation: fadeSlideUp 0.4s ease both">
          <div class="dialog-body" style="display:flex;flex-direction:column;align-items:flex-end;">
            <p class="dialog-name" style="color:rgba(148,163,184,0.5);align-self:flex-end;">你</p>
            <p class="dialog-text user-text">{{ memUserSubmitted }}</p>
          </div>
        </div>

        <div v-if="memReplyText.length > 0" class="dialog-bubble warm" style="animation: fadeSlideUp 0.6s ease both">
          <div class="dialog-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
          <div class="dialog-body">
            <p class="dialog-name">车娘</p>
            <p class="dialog-text warm-text">{{ memReplyText }}<span v-if="!memReplyDone" class="animate-pulse">|</span></p>
          </div>
        </div>

        <div v-if="memReplyDone" class="mem-saved-indicator" style="animation: fadeSlideUp 0.5s ease 0.5s both">
          <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6m0 0v6m0-6h.01M12 14l4 4m0 0l4-4m-4 4V14"/></svg>
          <span>记忆已保存</span>
        </div>
      </div>

      <div v-if="memPhase === 3" class="w-full max-w-lg mem-phase-in">
        <div class="mem-transition-text">
          {{ memTransitionText }}<span v-if="memTransitionText.length > 0 && memTransitionText.length < '两个月后，同一条路……'.length" class="animate-pulse">|</span>
        </div>
      </div>

      <div v-if="memPhase === 4" class="w-full max-w-lg mem-phase-in">
        <div class="dialog-bubble warm" style="animation: fadeSlideUp 0.8s ease both">
          <div class="dialog-avatar"><svg viewBox="0 0 24 24" class="w-5 h-5"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></div>
          <div class="dialog-body">
            <p class="dialog-name">车娘</p>
            <p class="dialog-text warm-text">{{ memRecallText }}<span v-if="!memRecallDone" class="animate-pulse">|</span></p>
          </div>
        </div>

        <div v-if="memAnnotation" class="mem-annotation" style="animation: fadeSlideUp 0.6s ease both">
          她不是查你的聊天记录。她是记得我们一起经历过的事。
        </div>
      </div>

      <div v-if="memPhase === 5" class="mem-finale-area">
        <p v-if="finaleVisible >= 1" class="mem-finale-line" style="animation: finaleFadeIn 1.5s ease both">
          感谢体验车娘 CarNiang
        </p>
        <p v-if="finaleVisible >= 2" class="mem-finale-line mem-finale-accent" style="animation: finaleFadeIn 1.5s ease both">
          你的车，活过来了。
        </p>
        <p v-if="finaleVisible >= 3" class="mem-finale-line" style="animation: finaleFadeIn 1.5s ease both">
          你换车，不换娘。
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.mem-phase-in { animation: memFadeIn 0.6s ease both; }
@keyframes memFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.mem-fade-overlay {
  background: radial-gradient(ellipse at 50% 50%, rgba(6,10,18,0.9) 0%, rgba(6,10,18,0.6) 100%);
  animation: overlayPulse 3s ease-in-out infinite;
}
@keyframes overlayPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.mem-input-area { margin-top: 20px; }
.mem-input-wrap {
  display: flex;
  gap: 10px;
  align-items: center;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(100, 180, 255, 0.12);
  border-radius: 8px;
  padding: 6px 6px 6px 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.mem-input-wrap:focus-within {
  border-color: rgba(34, 211, 238, 0.3);
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.06);
}
.mem-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: sans-serif;
  font-size: 14px;
  color: rgba(220, 235, 255, 0.9);
  caret-color: rgba(34, 211, 238, 0.8);
  padding: 6px 0;
}
.mem-input::placeholder { color: rgba(100, 116, 139, 0.4); }
.mem-send-btn {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(51, 65, 85, 0.4);
  color: rgba(100, 116, 139, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}
.mem-send-active {
  background: rgba(34, 211, 238, 0.2);
  color: rgba(34, 211, 238, 0.8);
}
.mem-send-active:hover { background: rgba(34, 211, 238, 0.3); }

.mem-saved-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  justify-content: center;
  color: rgba(34, 197, 94, 0.5);
  font-family: monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
}

.mem-transition-text {
  text-align: center;
  font-size: 15px;
  color: rgba(180, 200, 220, 0.45);
  letter-spacing: 0.15em;
  line-height: 2;
  font-style: italic;
}

.mem-annotation {
  margin-top: 24px;
  text-align: center;
  font-size: 13px;
  color: rgba(180, 200, 220, 0.4);
  font-style: italic;
  line-height: 1.8;
  letter-spacing: 0.05em;
  padding: 12px 0;
  border-top: 1px solid rgba(100, 180, 255, 0.05);
}

.mem-finale-area {
  text-align: center;
  padding: 40px 20px;
}

.mem-finale-line {
  font-size: 18px;
  letter-spacing: 0.12em;
  line-height: 2.8;
  color: rgba(180, 200, 220, 0.5);
  margin: 0;
}

.mem-finale-accent {
  color: rgba(140, 210, 255, 0.7);
  font-size: 20px;
  letter-spacing: 0.15em;
}

@keyframes finaleFadeIn {
  from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

.dialog-bubble { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px; opacity: 0; }
.dialog-avatar { flex-shrink: 0; color: rgba(34,211,238,0.6); margin-top: 2px; }
.dialog-body { flex: 1; min-width: 0; }
.dialog-name { font-family: monospace; font-size: 10px; letter-spacing: 0.1em; margin-bottom: 6px; color: rgba(34,211,238,0.5); }
.dialog-text { font-size: 14px; line-height: 1.9; color: rgba(200,220,255,0.85); padding: 12px 16px; background: rgba(15,30,55,0.5); border-left: 2px solid rgba(34,211,238,0.4); border-radius: 0 8px 8px 0; backdrop-filter: blur(4px); }
.dialog-text.warm-text { color: rgba(220,235,255,0.9); border-left-color: rgba(34,211,238,0.5); background: rgba(15,30,55,0.6); }
.dialog-text.user-text { color: rgba(200,220,255,0.8); border-left-color: rgba(100,116,139,0.35); background: rgba(20,30,50,0.4); border-radius: 8px 0 8px 8px; border-left: none; border-right: 2px solid rgba(100,116,139,0.25); text-align: right; }
</style>