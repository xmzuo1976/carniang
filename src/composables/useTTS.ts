import { ref } from 'vue'
import { VOLCENGINE_TTS_CONFIG } from '../tts.config'

// ─── 状态 ──────────────────────────────────────────────
const isSpeaking = ref(false)
const currentAudio = ref<HTMLAudioElement | null>(null)
const backend = ref<'mp3' | 'volcengine' | 'browser' | 'none'>('none')
let speakVersion = 0

// ─── 预生成 MP3 映射 ───────────────────────────────────
// key: 原始台词文本  →  value: public/voice/ 下的文件名
const MP3_MAP: Record<string, string> = {
  '……我醒了。': '/voice/awakening-1.mp3',
  '你在看我？': '/voice/awakening-2.mp3',
  '她在听。她在看。她在感受。': '/voice/sensing-1.mp3',
  '你都开了好久了……要不要在前面服务区歇一会儿？': '/voice/social-1.mp3',
  '刚才有人在，我没说。你今天状态不太好，前面服务区停一下吧。': '/voice/social-2.mp3',
  '你饿不饿？刚才路过一家面馆，看着挺香的。': '/voice/memory-1.mp3',
  '好，我记住了。': '/voice/memory-2.mp3',
  '感谢体验车娘 CarNiang': '/voice/finale-1.mp3',
  '你的车，活过来了。': '/voice/finale-2.mp3',
  '你换车，不换娘。': '/voice/finale-3.mp3',
  // 动态台词的默认版本（用户输入"牛肉面不错"时匹配）
  '诶，前面就是那家面馆。你上次说牛肉面不错——要不要拐过去？': '/voice/memory-recall-default.mp3',
}

// ─── MP3 播放 ──────────────────────────────────────────
async function playMp3(url: string, version: number): Promise<void> {
  if (version !== speakVersion) return

  const audio = new Audio(url)
  audio.playbackRate = 0.92
  currentAudio.value = audio

  // 淡入：先静音再渐增
  audio.volume = 0
  const fadeIn = setInterval(() => {
    if (audio.volume < 1) audio.volume = Math.min(1, audio.volume + 0.1)
    else clearInterval(fadeIn)
  }, 30)

  return new Promise((resolve, reject) => {
    audio.oncanplaythrough = () => { isSpeaking.value = true }
    audio.onended = () => {
      clearInterval(fadeIn)
      if (version === speakVersion) isSpeaking.value = false
      resolve()
    }
    audio.onerror = () => {
      clearInterval(fadeIn)
      if (version === speakVersion) isSpeaking.value = false
      reject(new Error(`Failed to load MP3: ${url}`))
    }
    audio.play().catch((e) => {
      clearInterval(fadeIn)
      if (version === speakVersion) isSpeaking.value = false
      reject(e)
    })
  })
}

// ─── 火山引擎 TTS ──────────────────────────────────────
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function isVolcengineReady(): boolean {
  return !!VOLCENGINE_TTS_CONFIG.token
}

async function volcengineSpeak(text: string, version: number): Promise<void> {
  const cfg = VOLCENGINE_TTS_CONFIG

  const body = {
    req_params: {
      text: text,
      speaker: cfg.speaker,
      audio_params: {
        format: 'mp3',
        sample_rate: 24000,
        speech_rate: -10,
      },
    },
  }

  try {
    const resp = await fetch('https://openspeech.bytedance.com/api/v3/tts/unidirectional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.token,
        'x-api-resource-id': cfg.resourceId,
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)

    // V3 API 返回 NDJSON（多行 JSON），音频可能分多个 data 块
    const respText = await resp.text()
    const chunks: string[] = []
    for (const line of respText.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const msg = JSON.parse(trimmed) as { code: number; data?: string }
        if (msg.code === 0 && msg.data) {
          chunks.push(msg.data)
        }
      } catch {
        // ignore
      }
    }

    if (!chunks.length) throw new Error('No audio data')
    const base64Audio = chunks.join('')

    const binary = atob(base64Audio)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)

    const audioCtx = new AudioContext({ sampleRate: 24000 })
    const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer)
    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer

    const gain = audioCtx.createGain()
    gain.gain.setValueAtTime(0, audioCtx.currentTime)
    gain.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.08)

    source.connect(gain).connect(audioCtx.destination)

    if (version !== speakVersion) return

    return new Promise<void>((resolve) => {
      source.onended = () => {
        audioCtx.close()
        if (version === speakVersion) isSpeaking.value = false
        resolve()
      }
      source.onerror = () => {
        audioCtx.close()
        if (version === speakVersion) isSpeaking.value = false
        resolve()
      }
      source.start(0)
    })
  } catch (e) {
    console.warn('[useTTS] 火山引擎请求失败，降级到浏览器语音:', e)
    if (version === speakVersion) isSpeaking.value = false
    backend.value = 'browser'
    browserSpeakInternal(text, version)
  }
}

// ─── 浏览器 TTS（最终降级）─────────────────────────────
let selectedVoice: SpeechSynthesisVoice | null = null
let voicesReady = false
let chromeKeepAliveTimer: ReturnType<typeof setInterval> | null = null

const voicePriority: string[] = ['Microsoft Yaoyao', 'Google 中文（中国大陆）']

function pickVoice() {
  if (voicesReady) return
  const synth = window.speechSynthesis
  if (!synth) return
  const voices = synth.getVoices()
  if (!voices.length) return
  voicesReady = true

  for (const name of voicePriority) {
    const found = voices.find(v => v.name.includes(name))
    if (found) { selectedVoice = found; return }
  }
  const zhCN = voices.filter(v => v.lang.startsWith('zh-CN'))
  if (zhCN.length) { selectedVoice = zhCN[0]; return }
  const zhAny = voices.find(v => v.lang.startsWith('zh'))
  if (zhAny) { selectedVoice = zhAny; return }
  selectedVoice = voices[0]
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.addEventListener('voiceschanged', pickVoice)
  pickVoice()
}

function preprocessForTTS(text: string): string {
  return text.replace(/——/g, '，').replace(/([。！？])/g, '$1 ').replace(/(……)/g, '$1 ').trim()
}

function splitSegments(text: string): string[] {
  return text.split(/(?<=[。！？…])\s*|(?<=[，、,])\s*/).map(s => s.trim()).filter(Boolean)
}

const PAUSE: Record<string, number> = { '。': 420, '！': 380, '？': 480, '…': 600, '，': 180, '、': 120, ',': 180 }

function browserSpeakInternal(text: string, version: number) {
  const synth = window.speechSynthesis
  if (!synth || version !== speakVersion) return

  pickVoice()
  const processed = preprocessForTTS(text)
  const segments = splitSegments(processed)

  if (segments.length <= 1 && text.length <= 6) {
    const u = new SpeechSynthesisUtterance(processed)
    if (selectedVoice) u.voice = selectedVoice
    u.lang = 'zh-CN'; u.rate = 0.90; u.pitch = 1.05; u.volume = 1.0
    u.onstart = () => { isSpeaking.value = true; startKeepAlive() }
    u.onend = () => { isSpeaking.value = false; stopKeepAlive() }
    u.onerror = () => { isSpeaking.value = false; stopKeepAlive() }
    synth.speak(u); return
  }

  startKeepAlive(); isSpeaking.value = true
  function chain(i: number) {
    if (i >= segments.length || version !== speakVersion) { isSpeaking.value = false; stopKeepAlive(); return }
    const seg = segments[i]
    const u = new SpeechSynthesisUtterance(seg)
    if (selectedVoice) u.voice = selectedVoice
    u.lang = 'zh-CN'; u.volume = 1.0
    const base = 0.92 + (Math.random() - 0.5) * 0.08
    u.rate = i === 0 ? base - 0.04 : base
    u.pitch = seg.endsWith('？') ? 1.08 : 1.05
    u.onend = () => setTimeout(() => chain(i + 1), PAUSE[seg.slice(-1)] ?? 200)
    u.onerror = () => setTimeout(() => chain(i + 1), 100)
    synth.speak(u)
  }
  chain(0)
}

function startKeepAlive() {
  stopKeepAlive()
  chromeKeepAliveTimer = setInterval(() => {
    const s = window.speechSynthesis
    if (s?.speaking) { s.pause(); s.resume() }
  }, 10000)
}
function stopKeepAlive() {
  if (chromeKeepAliveTimer != null) { clearInterval(chromeKeepAliveTimer); chromeKeepAliveTimer = null }
}

// ─── 统一接口 ──────────────────────────────────────────
async function speak(text: string): Promise<void> {
  console.log('[useTTS] speak() called:', text)
  // 先停止当前播放
  currentAudio.value?.pause()
  window.speechSynthesis?.cancel()
  stopKeepAlive()
  speakVersion++

  if (!text.trim()) return

  const ver = speakVersion

  // 1️⃣ 优先：预生成 MP3（直接尝试播放，加载失败则降级）
  const mp3Url = MP3_MAP[text]
  if (mp3Url) {
    try {
      backend.value = 'mp3'
      await playMp3(mp3Url, ver)
      return
    } catch (e) {
      console.warn('[useTTS] MP3 播放失败，降级:', e)
      // fallthrough to next backend
    }
  }

  // 2️⃣ 次选：火山引擎实时 API
  if (isVolcengineReady()) {
    backend.value = 'volcengine'
    isSpeaking.value = true
    await volcengineSpeak(text, ver)
    return
  }

  // 3️⃣ 保底：浏览器语音
  backend.value = window.speechSynthesis ? 'browser' : 'none'
  browserSpeakInternal(text, ver)
}

function stop(): void {
  currentAudio.value?.pause()
  window.speechSynthesis?.cancel()
  speakVersion++
  stopKeepAlive()
  isSpeaking.value = false
}

function setVoice(voiceName: string): void {
  const voices = window.speechSynthesis?.getVoices()
  if (!voices) return
  const found = voices.find(v => v.name.includes(voiceName))
  if (found) selectedVoice = found
}

function setVoiceUrl(_url: string): void {
  console.warn('[useTTS] setVoiceUrl: 请在 tts.config.ts 中配置火山引擎凭证')
}

export function useTTS() {
  return { speak, stop, setVoice, setVoiceUrl, isSpeaking, currentAudio, backend }
}
