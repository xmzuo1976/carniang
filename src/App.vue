<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TeardownScene from './components/TeardownScene.vue'
import AwakeningScene from './components/AwakeningScene.vue'
import SensingScene from './components/SensingScene.vue'
import SocialBoundaryScene from './components/SocialBoundaryScene.vue'
import MemoryScene from './components/MemoryScene.vue'
import { useBGM } from './composables/useBGM'

type SceneName = 'teardown' | 'awakening' | 'sensing' | 'social' | 'memory'

const currentScene = ref<SceneName>('teardown')
const previousScene = ref<SceneName>('teardown')
const { isMuted, init, play, toggleMute } = useBGM()

// 首次用户交互后启动 BGM
let bgmStarted = false
function onFirstInteraction() {
  if (bgmStarted) return
  bgmStarted = true
  init('/audio/bgm.wav')
  play()
  document.removeEventListener('click', onFirstInteraction)
  document.removeEventListener('keydown', onFirstInteraction)
}

onMounted(() => {
  document.addEventListener('click', onFirstInteraction, { once: false })
  document.addEventListener('keydown', onFirstInteraction, { once: false })
})

function enterScene(scene: 'awakening' | 'sensing' | 'social' | 'memory') {
  previousScene.value = currentScene.value
  currentScene.value = scene
}

function backToTeardown() {
  currentScene.value = 'teardown'
}

function onSceneComplete(scene: 'awakening' | 'sensing' | 'social') {
  const order: SceneName[] = ['awakening', 'sensing', 'social', 'memory']
  const idx = order.indexOf(scene)
  if (idx < order.length - 1) {
    currentScene.value = order[idx + 1]
  } else {
    currentScene.value = 'teardown'
  }
}
</script>

<template>
  <div class="cockpit relative w-full h-screen overflow-hidden bg-[#060a12] select-none">

    <!-- 顶部品牌栏 -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50
                font-mono text-[11px] tracking-[0.2em] uppercase
                text-cyan-400/60 border border-cyan-400/20 px-3 py-1 rounded-sm
                bg-cyan-950/30 backdrop-blur-sm">
      车娘 CarNiang · TRAE 初赛演示
    </div>

    <!-- BGM 静音切换 -->
    <button
      @click="toggleMute"
      class="absolute top-4 right-4 z-50
             font-mono text-[13px] tracking-wider
             text-cyan-400/70 border border-cyan-400/20 w-8 h-8 rounded-sm
             bg-cyan-950/40 backdrop-blur-sm flex items-center justify-center
             hover:bg-cyan-950/60 hover:border-cyan-400/40 transition-all"
      :title="isMuted ? '开启背景音乐' : '关闭背景音乐'">
      {{ isMuted ? '🔇' : '🎵' }}
    </button>

    <!-- 返回按钮（在场景体验时显示） -->
    <button
      v-if="currentScene !== 'teardown'"
      @click="backToTeardown"
      class="absolute top-4 left-4 z-50
             font-mono text-[11px] tracking-wider
             text-cyan-400/70 border border-cyan-400/20 px-3 py-1.5 rounded-sm
             bg-cyan-950/40 backdrop-blur-sm
             hover:bg-cyan-950/60 hover:border-cyan-400/40 transition-all">
      ← 返回拆解图
    </button>

    <!-- 场景切换 -->
    <TeardownScene
      v-if="currentScene === 'teardown'"
      @enter-scene="enterScene"
    />

    <AwakeningScene
      v-if="currentScene === 'awakening'"
      @complete="onSceneComplete('awakening')"
    />
    <SensingScene
      v-if="currentScene === 'sensing'"
      @complete="onSceneComplete('sensing')"
    />
    <SocialBoundaryScene
      v-if="currentScene === 'social'"
      @complete="onSceneComplete('social')"
    />
    <MemoryScene
      v-if="currentScene === 'memory'"
    />

  </div>
</template>

<style>
.animate-pulse { animation: cursorBlink 0.8s step-end infinite; }
@keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes fadeSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.scene-btn { font-family: monospace; font-size: 11px; letter-spacing: 0.15em; color: rgba(34,211,238,0.7); border: 1px solid rgba(34,211,238,0.2); padding: 8px 20px; border-radius: 3px; background: rgba(8,51,68,0.2); backdrop-filter: blur(8px); cursor: pointer; transition: all 0.3s ease; }
.scene-btn:hover { background: rgba(8,51,68,0.35); color: rgba(103,232,249,0.9); border-color: rgba(34,211,238,0.4); }
</style>