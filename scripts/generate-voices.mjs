#!/usr/bin/env node
/**
 * 批量预生成车娘台词语音（火山引擎语音合成大模型 V3 API）
 * 用法：node scripts/generate-voices.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const voiceDir = join(rootDir, 'public', 'voice')

// ─── 读取 .env ─────────────────────────────────────────
function loadEnv() {
  const envPath = join(rootDir, '.env')
  if (!existsSync(envPath)) {
    console.error('❌ 找不到 .env 文件。请复制 .env.example 为 .env 并填入凭证。')
    process.exit(1)
  }
  const env = {}
  readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const m = line.match(/^VITE_(\w+)=(.*)$/)
    if (m) env[m[1]] = m[2].trim()
  })
  return env
}

const env = loadEnv()
const API_KEY = env.VOLCENGINE_TOKEN || ''

if (!API_KEY) {
  console.error('❌ .env 中缺少 VOLCENGINE_TOKEN')
  process.exit(1)
}

// 推荐女声：甜美桃子（温柔自然，豆包风格）
// 旧版：zh_female_qingxinnvsheng_mars_bigtts（清新，偏生硬）
const SPEAKER = env.VOLCENGINE_SPEAKER || 'zh_female_tianmeitaozi_mars_bigtts'

// ─── 台词清单 ──────────────────────────────────────────
const lines = [
  { id: 'awakening-1', text: '……我醒了。' },
  { id: 'awakening-2', text: '你在看我？' },
  { id: 'sensing-1', text: '她在听。她在看。她在感受。' },
  { id: 'social-1', text: '你都开了好久了……要不要在前面服务区歇一会儿？' },
  { id: 'social-2', text: '刚才有人在，我没说。你今天状态不太好，前面服务区停一下吧。' },
  { id: 'memory-1', text: '你饿不饿？刚才路过一家面馆，看着挺香的。' },
  { id: 'memory-2', text: '好，我记住了。' },
  { id: 'memory-recall-default', text: '诶，前面就是那家面馆。你上次说牛肉面不错——要不要拐过去？' },
  { id: 'finale-1', text: '感谢体验车娘 CarNiang' },
  { id: 'finale-2', text: '你的车，活过来了。' },
  { id: 'finale-3', text: '你换车，不换娘。' },
]

// ─── 确保目录存在 ──────────────────────────────────────
if (!existsSync(voiceDir)) {
  mkdirSync(voiceDir, { recursive: true })
}

// ─── 生成单条语音 ──────────────────────────────────────
async function generateVoice({ id, text }) {
  const outPath = join(voiceDir, `${id}.mp3`)

  if (existsSync(outPath)) {
    console.log(`⏭️  跳过已存在: ${id}.mp3`)
    return
  }

  const body = {
    req_params: {
      text: text,
      speaker: SPEAKER,
      additions: JSON.stringify({
        disable_markdown_filter: true,
        enable_language_detector: true,
        enable_latex_tn: true,
        disable_emotion_filter: false,
      }),
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
        'x-api-key': API_KEY,
        'x-api-resource-id': 'volc.service_type.10029',
        'Connection': 'keep-alive',
      },
      body: JSON.stringify(body),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      throw new Error(`HTTP ${resp.status}: ${errText}`)
    }

    // V3 API 返回 NDJSON（多行 JSON），每行一个消息
    // 音频数据可能分多个 data 块返回，需全部拼接
    const respText = await resp.text()
    const chunks = []
    for (const line of respText.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      try {
        const msg = JSON.parse(trimmed)
        if (msg.code === 0 && msg.data) {
          chunks.push(msg.data)
        }
      } catch {
        // 忽略解析失败的行
      }
    }

    if (!chunks.length) {
      throw new Error('响应中无音频数据')
    }

    const base64Audio = chunks.join('')
    const buffer = Buffer.from(base64Audio, 'base64')
    writeFileSync(outPath, buffer)
    console.log(`✅ 生成成功: ${id}.mp3 (${buffer.length} bytes, ${text.length}字)`)
  } catch (e) {
    console.error(`❌ 生成失败: ${id} — ${e.message}`)
  }
}

// ─── 主流程 ────────────────────────────────────────────
console.log(`🎙️  开始批量生成语音 (${lines.length} 条)`)
console.log(`   音色: ${SPEAKER}`)
console.log('')

for (const line of lines) {
  await generateVoice(line)
  // 避免触发频率限制
  await new Promise(r => setTimeout(r, 500))
}

console.log('')
console.log('🎉 全部完成！语音文件保存在 public/voice/')
console.log(`   总计字符: ${lines.reduce((s, l) => s + l.text.length, 0)}`)
