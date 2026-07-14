import { ref } from 'vue'

const bgmAudio = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const isMuted = ref(false)

/**
 * 初始化背景音乐（循环、低音量、淡入）
 * 首次需用户交互后调用（浏览器策略）
 */
export function useBGM() {
  function init(src: string) {
    if (bgmAudio.value) return // 已初始化
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0 // 从 0 开始淡入
    audio.preload = 'auto'
    bgmAudio.value = audio

    // 淡入到目标音量
    audio.addEventListener('canplaythrough', () => {
      if (!isMuted.value) fadeIn()
    }, { once: true })
  }

  function fadeIn(duration = 3000) {
    const audio = bgmAudio.value
    if (!audio) return
    const target = 0.3  // BGM 音量上限（30%）
    const steps = 60
    const interval = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      audio.volume = Math.min(target, target * (step / steps))
      if (step >= steps) {
        audio.volume = target
        clearInterval(timer)
      }
    }, interval)
  }

  function play() {
    const audio = bgmAudio.value
    if (!audio) return
    audio.play().then(() => {
      isPlaying.value = true
      if (audio.volume < 0.05) fadeIn()
    }).catch(() => {
      // 浏览器可能阻止自动播放，静默忽略
    })
  }

  function pause() {
    bgmAudio.value?.pause()
    isPlaying.value = false
  }

  function toggleMute() {
    if (isMuted.value) {
      bgmAudio.value && (bgmAudio.value.volume = 0.3)
      isMuted.value = false
      if (!isPlaying.value) play()
    } else {
      bgmAudio.value && (bgmAudio.value.volume = 0)
      isMuted.value = true
    }
  }

  function stop() {
    if (bgmAudio.value) {
      bgmAudio.value.pause()
      bgmAudio.value.currentTime = 0
    }
    isPlaying.value = false
  }

  return { isPlaying, isMuted, init, play, pause, toggleMute, stop }
}