<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useTTS } from '../composables/useTTS'

const emit = defineEmits<{
  'enter-scene': [scene: 'awakening' | 'sensing' | 'social' | 'memory']
}>()

const { speak, stop: stopTTS } = useTTS()

// ─── 自动播报控制 ─────────────────────────
const autoSpeakEnabled = ref(true)
const spokenSections = ref(new Set<string>())

// ─── 模块数据 ─────────────────────────────
const sections = [
  {
    id: 'cockpit',
    num: '00',
    title: '实际场景：驾驶室',
    desc: '夜间驾驶的真实环境，赛博方块安静地守护在仪表台上',
    image: '/images/car-cockpit-panorama.jpg',
    intro: '这是深夜高速上的真实驾驶场景。赛博方块安静地立在仪表台上，青色呼吸光随她的情绪轻轻明灭。她在看你在看你是否疲惫，她在听你是否有乘客在说话。你感知不到她的存在，但她一直在。',
    scene: null as string | null,
  },
  {
    id: 'hardware',
    num: '01',
    title: '硬件终端：赛博方块',
    desc: '手掌大小的座舱感知终端，AI 的眼睛、耳朵和平衡感',
    image: '/images/cybercube-exploded.jpg',
    intro: '赛博方块是车娘 CarNiang 的感官器官。不锈钢外壳刻有神秘几何纹路，纹路间有青色呼吸光带随情绪流动。底部万向底座可俯仰旋转，电源接口置于背面，通过车载供电持续工作。内置 DMS 近红外摄像头、广角摄像头、麦克风阵列、IMU 六轴传感器。',
    scene: null as string | null,
    specs: [
      { icon: '👁', name: 'DMS 近红外摄像头', detail: 'NIR + IR 补光，70°-90° FOV，监测疲劳、视线偏移' },
      { icon: '📷', name: '广角摄像头', detail: '120°-150° FOV，感知座舱环境，不做面部识别' },
      { icon: '🎤', name: '麦克风阵列', detail: '声源定位、波束成形、回声消除，远场拾音' },
      { icon: '📐', name: 'IMU 六轴传感器', detail: '感知车辆姿态、急刹/急转/颠簸' },
      { icon: '📍', name: '手机 GPS + 地图', detail: '位置、路况、POI 语义关联' },
    ],
  },
  {
    id: 'senses',
    num: '02',
    title: '五感融合系统',
    desc: '五路传感器数据实时融合，形成对座舱的完整感知',
    image: '/images/five-senses-system.jpg',
    intro: '五感融合系统让车娘能够同时看见驾驶员状态、听见车内对话、感受车辆运动、理解所处位置。',
    scene: 'sensing',
    senses: [
      { icon: '👁', name: '视觉', desc: '驾驶员疲劳？有乘客？后排有孩子？', color: 'rgba(0,180,255,0.15)' },
      { icon: '🎧', name: '听觉', desc: '谁在说话？驾驶员命令还是乘客闲聊？', color: 'rgba(245,158,11,0.15)' },
      { icon: '📳', name: '触觉', desc: '车在急刹？过弯？路况如何？', color: 'rgba(239,68,68,0.15)' },
      { icon: '👥', name: '空间', desc: '座舱里有几个人？他们在做什么？', color: 'rgba(34,197,94,0.15)' },
      { icon: '📍', name: '位置', desc: '这是哪里？附近有什么熟悉的地点？', color: 'rgba(168,85,247,0.15)' },
    ],
  },
  {
    id: 'architecture',
    num: '03',
    title: '软件架构',
    desc: '从感知到决策到表达，四层架构让 AI 真正「活在车里」',
    image: null as string | null,
    intro: '五感数据融合后，依次经过社交边界引擎、记忆系统、星瑶角色引擎，最终通过语音输出到车内。',
    scene: null,
    layers: [
      { icon: '🧩', title: '五感数据融合层', desc: 'DMS + 广角 + 麦克风 + IMU + GPS 本地实时融合' },
      { icon: '🎭', title: '社交边界引擎', desc: '根据座舱社交状态动态调整 AI 行为策略' },
      { icon: '💭', title: '记忆系统', desc: '记忆建立 → 存储 → 情境触发回忆' },
      { icon: '✨', title: '星瑶 AI 角色引擎', desc: '人格 + 情绪 + 豆包语音合成' },
      { icon: '🔊', title: '语音输出 + 显示', desc: '预生成语音 → 火山引擎合成 → 浏览器兜底' },
    ],
  },
  {
    id: 'social',
    num: '04',
    title: '社交边界引擎',
    desc: 'AI 不是时刻在线，而是知进退、懂场合',
    image: '/images/social-boundary.jpg',
    intro: '车娘会根据座舱内的人数和对话状态调整自己的行为。独自驾驶时主动关怀，有人聊天时安静旁听，后排有儿童时切换家庭模式。',
    scene: 'social',
    behaviors: [
      { icon: '🙋', name: '独自驾驶', desc: '主动关怀，疲劳监测，主动搭话' },
      { icon: '💬', name: '副驾聊天中', desc: '安静旁听，不插嘴，必要时轻声提醒路况' },
      { icon: '👶', name: '后排有儿童', desc: '切换家庭模式，语速放缓，内容过滤' },
      { icon: '🛡', name: '专注驾驶', desc: '减少非必要语音，优先安全提醒' },
    ],
  },
  {
    id: 'memory',
    num: '05',
    title: '记忆系统',
    desc: '不是查数据库，是真的记得你们一起经历过什么',
    image: '/images/demo-memory.jpg',
    intro: '记忆分为两个阶段：建立与回忆。当用户说「牛肉面不错」，两个月后经过同一条路，车娘会自然唤起这段记忆。',
    scene: 'memory',
    memoryStages: [
      { icon: '📝', title: '阶段一：记忆建立', desc: '深夜驾驶时车娘问「你饿不饿？」用户回答「牛肉面不错」→ 记录为偏好 + 地点关联记忆' },
      { icon: '🔮', title: '阶段二：记忆回忆', desc: '两个月后同一条路，车娘说：「你上次说牛肉面不错——要不要拐过去？」' },
    ],
  },
  {
    id: 'demo-scenes',
    num: '06',
    title: '演示场景',
    desc: '从觉醒到终幕，五个场景讲述车娘诞生的故事',
    image: null,
    intro: '演示包含觉醒、感知、社交边界、记忆和终幕五个场景，点击下方卡片即可进入体验。',
    scene: null,
    scenes: [
      { tag: '场景 01', title: '觉醒', desc: '赛博方块通电，五感依次点亮，星瑶从虚无中「醒来」', img: '/images/demo-awakening.jpg', scene: 'awakening' },
      { tag: '场景 02', title: '感知', desc: '五感数据流向 AI：「她在听。她在看。她在感受。」', img: '/images/demo-sensing.jpg', scene: 'sensing' },
      { tag: '场景 03', title: '社交边界', desc: '独自驾驶 → 副驾加入 → 后排有儿童', img: null, scene: 'social' },
      { tag: '场景 04-05', title: '记忆 + 终幕', desc: '两阶段记忆交互 + 「感谢体验车娘 CarNiang」', img: '/images/car-scene-demo.jpg', scene: 'memory' },
    ],
  },
  {
    id: 'privacy',
    num: '07',
    title: '隐私设计',
    desc: '从硬件到软件的三层防护，隐私是产品底线而非可选项',
    image: '/images/privacy-design.jpg',
    intro: 'CarNiang 将隐私视为产品底线。硬件指示灯不可软件关闭，物理遮蔽一键切断摄像头，原始数据仅内存处理。',
    scene: null,
    privacyLayers: [
      { level: '第一层 · 物理层', title: '硬件层', items: ['摄像头硬件指示灯，工作必亮', '软件不可关闭指示灯', '物理遮蔽滑盖，一键切断广角摄像头', '电源接口置于背面，持续供电'] },
      { level: '第二层 · 处理层', title: '处理层', items: ['原始画面仅在内存中临时处理', '默认不保存任何原始影像', '不做乘客面部识别', '仅检测存在与活动状态'] },
      { level: '第三层 · 行为层', title: '行为层', items: ['乘客隐私模式一键开启', 'AI 主动降低视觉感知权重', '仅保留安全相关监测', '数据上传需用户明确授权'] },
    ],
  },
  {
    id: 'roadmap',
    num: '08',
    title: '技术路线图',
    desc: '从演示到原型到量产，三个阶段逐步实现',
    image: null,
    intro: '当前处于演示验证阶段，后续将推进原型验证和量产阶段。',
    scene: null,
    phases: [
      { badge: '当前', title: '演示验证', desc: '验证交互逻辑与情感体验', tags: ['USB 摄像头', '电脑推理', 'Vue3 演示', '预生成语音'], active: true },
      { badge: '第二阶段', title: '原型验证', desc: '实车环境验证五感融合效果', tags: ['NIR 摄像头', '4 麦克风阵列', '本地化感知', '云端大模型'], active: false },
      { badge: '第三阶段', title: '量产阶段', desc: '低成本量产，即插即用', tags: ['车规级模组', '本地/手机混合推理', '在线升级', '开放接口'], active: false },
    ],
  },
]

// ─── IntersectionObserver 滚动动画 ────────
const visibleSections = ref(new Set<string>())
let observer: IntersectionObserver | null = null

onMounted(() => {
  nextTick(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section')
          if (!id) return
          if (entry.isIntersecting) {
            visibleSections.value.add(id)
            // 自动播报（仅第一次）
            if (autoSpeakEnabled.value && !spokenSections.value.has(id)) {
              const section = sections.find(s => s.id === id)
              if (section?.intro) {
                spokenSections.value.add(id)
                speak(section.intro)
              }
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer?.observe(el)
    })
  })
})

onUnmounted(() => {
  observer?.disconnect()
  stopTTS()
})

function onEnterScene(scene: string) {
  stopTTS()
  if (['awakening', 'sensing', 'social', 'memory'].includes(scene)) {
    emit('enter-scene', scene as 'awakening' | 'sensing' | 'social' | 'memory')
  }
}

function scrollToSection(id: string) {
  const el = document.querySelector(`[data-section="${id}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function toggleAutoSpeak() {
  autoSpeakEnabled.value = !autoSpeakEnabled.value
  if (!autoSpeakEnabled.value) {
    stopTTS()
  }
}
</script>

<template>
  <div class="teardown-root">
    <!-- 顶部导航 -->
    <nav class="teardown-nav">
      <div class="nav-brand">
        <span class="nav-icon">◈</span>
        <span>CarNiang</span>
      </div>
      <div class="nav-links">
        <button v-for="s in sections" :key="s.id" @click="scrollToSection(s.id)">
          {{ s.num }}
        </button>
        <button class="auto-speak-btn" :class="{ active: autoSpeakEnabled }" @click="toggleAutoSpeak">
          {{ autoSpeakEnabled ? '🔊' : '🔇' }}
        </button>
      </div>
    </nav>

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-content">
        <img src="/images/xingyao-portrait.jpg" alt="星瑶" class="hero-avatar">
        <h1>车娘 CarNiang</h1>
        <p class="hero-subtitle">你的车，真的在看向你</p>
        <p class="hero-tagline">硬件 × AI × 陪伴</p>
        <div class="hero-scroll-hint">
          <span>↓ 向下滚动探索产品拆解</span>
        </div>
      </div>
    </section>

    <!-- 各模块 -->
    <div v-for="s in sections" :key="s.id" :data-section="s.id" class="section-wrapper"
         :class="{ visible: visibleSections.has(s.id) }">

      <!-- Section Header -->
      <div class="section-header">
        <span class="section-num">{{ s.num }}</span>
        <h2>{{ s.title }}</h2>
      </div>
      <p class="section-desc">{{ s.desc }}</p>

      <!-- 00 驾驶室全景 -->
      <div v-if="s.id === 'cockpit'" class="cockpit-layout">
        <div class="cockpit-image">
          <img :src="s.image" alt="驾驶室全景">
        </div>
      </div>

      <!-- 01 硬件 -->
      <div v-if="s.id === 'hardware'" class="hardware-layout">
        <div class="hardware-image">
          <img :src="s.image" alt="赛博方块爆炸图">
        </div>
        <div class="hardware-specs">
          <div v-for="spec in s.specs" :key="spec.name" class="spec-card">
            <div class="spec-name">{{ spec.icon }} {{ spec.name }}</div>
            <div class="spec-detail">{{ spec.detail }}</div>
          </div>
        </div>
      </div>

      <!-- 02 五感 -->
      <div v-if="s.id === 'senses'" class="senses-layout">
        <div class="senses-grid">
          <div v-for="sense in s.senses" :key="sense.name" class="sense-card"
               :style="{ '--sense-bg': sense.color }">
            <div class="sense-icon" :style="{ background: sense.color }">{{ sense.icon }}</div>
            <h3>{{ sense.name }}</h3>
            <p>{{ sense.desc }}</p>
          </div>
        </div>
        <div class="senses-image">
          <img :src="s.image" alt="五感系统">
        </div>
        <button v-if="s.scene" class="scene-enter-btn" @click="onEnterScene(s.scene)">
          体验「感知」场景 →
        </button>
      </div>

      <!-- 03 架构 -->
      <div v-if="s.id === 'architecture'" class="arch-layout">
        <div class="arch-flow">
          <div v-for="(layer, idx) in s.layers" :key="layer.title" class="arch-item">
            <div class="arch-icon">{{ layer.icon }}</div>
            <div class="arch-text">
              <h4>{{ layer.title }}</h4>
              <p>{{ layer.desc }}</p>
            </div>
          </div>
          <div v-for="n in s.layers.length - 1" :key="n" class="arch-arrow">↓</div>
        </div>
      </div>

      <!-- 04 社交边界 -->
      <div v-if="s.id === 'social'" class="social-layout">
        <div class="social-image">
          <img :src="s.image" alt="社交边界">
        </div>
        <div class="social-grid">
          <div v-for="b in s.behaviors" :key="b.name" class="behavior-card">
            <div class="behavior-icon">{{ b.icon }}</div>
            <h3>{{ b.name }}</h3>
            <p>{{ b.desc }}</p>
          </div>
        </div>
        <button v-if="s.scene" class="scene-enter-btn" @click="onEnterScene(s.scene)">
          体验「社交边界」场景 →
        </button>
      </div>

      <!-- 05 记忆 -->
      <div v-if="s.id === 'memory'" class="memory-layout">
        <div class="memory-image">
          <img :src="s.image" alt="记忆场景">
        </div>
        <div class="memory-stages">
          <div v-for="stage in s.memoryStages" :key="stage.title" class="stage-card">
            <div class="stage-icon">{{ stage.icon }}</div>
            <div class="stage-text">
              <h4>{{ stage.title }}</h4>
              <p>{{ stage.desc }}</p>
            </div>
          </div>
          <div class="stage-arrow">↓ 两个月后，同一条路……</div>
        </div>
        <div class="memory-note">
          <strong>关键设计：</strong>记忆不是搜索引擎式的「查询」，而是情境触发式的「回忆」。时间、地点、情绪、社交状态共同构成回忆的触发条件。
        </div>
        <button v-if="s.scene" class="scene-enter-btn" @click="onEnterScene(s.scene)">
          体验「记忆」场景 →
        </button>
      </div>

      <!-- 06 演示场景 -->
      <div v-if="s.id === 'demo-scenes'" class="scenes-layout">
        <div class="scenes-grid">
          <div v-for="scene in s.scenes" :key="scene.tag"
               class="scene-card" :class="{ wide: !!scene.img }"
               @click="scene.scene && onEnterScene(scene.scene)">
            <img v-if="scene.img" :src="scene.img" alt="">
            <div class="scene-body">
              <span class="scene-tag">{{ scene.tag }}</span>
              <h4>{{ scene.title }}</h4>
              <p>{{ scene.desc }}</p>
              <span v-if="scene.scene" class="scene-enter-label">点击进入 →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 07 隐私 -->
      <div v-if="s.id === 'privacy'" class="privacy-layout">
        <div class="privacy-image">
          <img :src="s.image" alt="隐私设计">
        </div>
        <div class="privacy-grid">
          <div v-for="layer in s.privacyLayers" :key="layer.level" class="privacy-card">
            <div class="privacy-level">{{ layer.level }}</div>
            <h4>{{ layer.title }}</h4>
            <ul>
              <li v-for="item in layer.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 08 路线图 -->
      <div v-if="s.id === 'roadmap'" class="roadmap-layout">
        <div class="roadmap-grid">
          <div v-for="phase in s.phases" :key="phase.badge" class="roadmap-card" :class="{ active: phase.active }">
            <span class="roadmap-badge">{{ phase.badge }}</span>
            <h4>{{ phase.title }}</h4>
            <p>{{ phase.desc }}</p>
            <div class="roadmap-tags">
              <span v-for="tag in phase.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <footer class="teardown-footer">
      <h2>你换车，不换娘。</h2>
      <p>车娘 CarNiang · TRAE AI 创造力大赛 · 硬件交互赛道</p>
    </footer>
  </div>
</template>

<style scoped>
/* ===== Root & Scrollbar ===== */
.teardown-root {
  min-height: 100vh;
  background: #080c14;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  line-height: 1.7;
  position: relative;
}

.teardown-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: linear-gradient(rgba(0,180,255,0.025) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,180,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 0;
}

/* ===== Navigation ===== */
.teardown-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(8, 12, 20, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,180,255,0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  color: #00ccff;
}

.nav-icon { font-size: 1.25rem; }

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-links button {
  background: transparent;
  border: 1px solid rgba(0,180,255,0.15);
  color: rgba(148, 163, 184, 0.7);
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-links button:hover {
  border-color: rgba(0,180,255,0.4);
  color: #00ccff;
  background: rgba(0,180,255,0.08);
}

.auto-speak-btn {
  margin-left: 0.5rem !important;
}

.auto-speak-btn.active {
  border-color: rgba(0,180,255,0.5) !important;
  color: #00ccff !important;
}

/* ===== Hero ===== */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at center top, rgba(0,100,160,0.1) 0%, transparent 60%);
}

.hero-content {
  text-align: center;
  z-index: 1;
  padding: 1.5rem;
}

.hero-avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin: 0 auto 2rem;
  border: 2px solid rgba(0,180,255,0.4);
  box-shadow: 0 0 60px rgba(0,180,255,0.2), 0 0 120px rgba(0,180,255,0.08);
  object-fit: cover;
  animation: avatarPulse 4s ease-in-out infinite;
}

@keyframes avatarPulse {
  0%, 100% { box-shadow: 0 0 60px rgba(0,180,255,0.2), 0 0 120px rgba(0,180,255,0.08); }
  50% { box-shadow: 0 0 80px rgba(0,180,255,0.35), 0 0 160px rgba(0,180,255,0.12); }
}

.hero-section h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #fff 0%, #00ccff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.hero-tagline {
  font-size: 0.875rem;
  color: rgba(0,180,255,0.7);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: #64748b;
  font-size: 0.8rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}

/* ===== Section Wrapper ===== */
.section-wrapper {
  padding: 3rem 1.5rem;
  max-width: 960px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.section-wrapper.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.section-num {
  font-size: 0.8rem;
  color: #00ccff;
  border: 1px solid rgba(0,180,255,0.3);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
  font-family: monospace;
}

.section-header h2 {
  font-size: 1.6rem;
  font-weight: 700;
}

.section-desc {
  color: #94a3b8;
  margin-bottom: 2rem;
  font-size: 1rem;
}

/* ===== Scene Enter Button ===== */
.scene-enter-btn {
  margin-top: 1.5rem;
  background: rgba(0, 180, 255, 0.1);
  border: 1px solid rgba(0, 180, 255, 0.3);
  color: #00ccff;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.scene-enter-btn:hover {
  background: rgba(0, 180, 255, 0.2);
  border-color: rgba(0, 180, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 180, 255, 0.15);
  transform: translateX(4px);
}

/* ===== Cockpit Panorama ===== */
.cockpit-layout {
  margin-top: 2rem;
}
.cockpit-image img {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(0,180,255,0.15);
  box-shadow: 0 0 40px rgba(0,180,255,0.08);
}

/* ===== Hardware Layout ===== */
.hardware-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  align-items: start;
}

.hardware-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0,180,255,0.15);
}

.hardware-specs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.spec-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.spec-card:hover {
  border-color: rgba(0,180,255,0.3);
  box-shadow: 0 0 16px rgba(0,180,255,0.08);
  transform: translateX(4px);
}

.spec-name {
  font-weight: 600;
  color: #00ccff;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.spec-detail {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* ===== Senses Layout ===== */
.senses-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.sense-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1rem 0.6rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sense-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 2px;
  background: #00ccff;
  opacity: 0.4;
}

.sense-card:hover {
  border-color: rgba(0,180,255,0.3);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,180,255,0.1);
}

.sense-icon {
  width: 36px;
  height: 36px;
  margin: 0 auto 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.sense-card h3 {
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.sense-card p {
  font-size: 0.68rem;
  color: #64748b;
  line-height: 1.3;
}

.senses-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0,180,255,0.15);
}

/* ===== Architecture Layout ===== */
.arch-flow {
  display: flex;
  flex-direction: column;
  gap: 0;
  max-width: 700px;
  margin: 0 auto;
}

.arch-item {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.arch-item:hover {
  border-color: rgba(0,180,255,0.3);
}

.arch-item + .arch-arrow,
.arch-arrow + .arch-item {
  margin-top: 0.75rem;
}

.arch-arrow {
  text-align: center;
  color: #00ccff;
  font-size: 1.25rem;
  opacity: 0.4;
  padding: 0.25rem;
}

.arch-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(0,180,255,0.08);
  border: 1px solid rgba(0,180,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.arch-text h4 {
  font-size: 1rem;
  margin-bottom: 0.15rem;
}

.arch-text p {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* ===== Social Layout ===== */
.social-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.social-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0,180,255,0.15);
}

.social-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.behavior-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1rem 0.8rem;
  text-align: center;
  transition: all 0.3s ease;
}

.behavior-card:hover {
  border-color: rgba(0,180,255,0.3);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,180,255,0.08);
}

.behavior-icon {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.behavior-card h3 {
  font-size: 0.82rem;
  margin-bottom: 0.2rem;
}

.behavior-card p {
  font-size: 0.7rem;
  color: #64748b;
  line-height: 1.3;
}

/* ===== Memory Layout ===== */
.memory-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.memory-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0,180,255,0.15);
}

.memory-stages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
}

.stage-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stage-card:hover {
  border-color: rgba(0,180,255,0.3);
}

.stage-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(0,180,255,0.08);
  border: 1px solid rgba(0,180,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.stage-text h4 {
  font-size: 0.95rem;
  margin-bottom: 0.2rem;
}

.stage-text p {
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.5;
}

.stage-arrow {
  text-align: center;
  color: rgba(0,180,255,0.5);
  font-size: 0.85rem;
  padding: 0.5rem;
}

.memory-note {
  padding: 1.25rem;
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.6;
}

.memory-note strong {
  color: #00ccff;
}

/* ===== Scenes Layout ===== */
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.scene-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.scene-card:hover {
  border-color: rgba(0,180,255,0.3);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,180,255,0.1);
}

.scene-card.wide {
  grid-column: span 2;
}

.scene-card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid rgba(0,180,255,0.1);
}

.scene-body {
  padding: 1rem;
}

.scene-tag {
  font-size: 0.7rem;
  color: #00ccff;
  border: 1px solid rgba(0,180,255,0.25);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  display: inline-block;
  margin-bottom: 0.4rem;
}

.scene-body h4 {
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.scene-body p {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.4;
}

.scene-enter-label {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #00ccff;
  opacity: 0.7;
}

.scene-card:hover .scene-enter-label {
  opacity: 1;
}

/* ===== Privacy Layout ===== */
.privacy-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.privacy-image img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(0,180,255,0.15);
}

.privacy-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.privacy-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.privacy-card:hover {
  border-color: rgba(0,180,255,0.3);
  box-shadow: 0 6px 20px rgba(0,180,255,0.08);
}

.privacy-level {
  font-size: 0.7rem;
  color: #00ccff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.privacy-card h4 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.privacy-card ul {
  list-style: none;
  text-align: left;
}

.privacy-card li {
  font-size: 0.72rem;
  color: #94a3b8;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  display: flex;
  align-items: flex-start;
  gap: 0.3rem;
}

.privacy-card li::before {
  content: '✓';
  color: #22c55e;
  flex-shrink: 0;
  font-size: 0.7rem;
}

/* ===== Roadmap Layout ===== */
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.roadmap-card {
  background: #111827;
  border: 1px solid rgba(0,180,255,0.1);
  border-radius: 10px;
  padding: 1.2rem 1rem;
  position: relative;
  transition: all 0.3s ease;
}

.roadmap-card:hover {
  border-color: rgba(0,180,255,0.25);
}

.roadmap-card.active {
  border-color: rgba(0,180,255,0.4);
  box-shadow: 0 0 24px rgba(0,180,255,0.1);
}

.roadmap-badge {
  position: absolute;
  top: -10px;
  left: 1rem;
  background: #080c14;
  border: 1px solid rgba(0,180,255,0.3);
  color: #00ccff;
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
}

.roadmap-card h4 {
  margin-top: 0.4rem;
  margin-bottom: 0.3rem;
  font-size: 1rem;
}

.roadmap-card p {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.roadmap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.roadmap-tags span {
  font-size: 0.7rem;
  background: rgba(0,180,255,0.06);
  color: rgba(0,180,255,0.7);
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
}

/* ===== Footer ===== */
.teardown-footer {
  text-align: center;
  padding: 4rem 2rem;
  border-top: 1px solid rgba(0,180,255,0.1);
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.teardown-footer h2 {
  font-size: 1.8rem;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #fff 0%, #00ccff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.teardown-footer p {
  color: #64748b;
  font-size: 0.9rem;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .hero-section h1 { font-size: 2.2rem; }
  .hardware-layout { grid-template-columns: 1fr; }
  .senses-grid { grid-template-columns: repeat(2, 1fr); }
  .social-grid { grid-template-columns: repeat(2, 1fr); }
  .scenes-grid { grid-template-columns: 1fr; }
  .scene-card.wide { grid-column: span 1; }
  .privacy-grid { grid-template-columns: 1fr; }
  .roadmap-grid { grid-template-columns: 1fr; }
  .teardown-nav { padding: 0.5rem 1rem; }
  .nav-links button:not(.auto-speak-btn) { display: none; }
}
</style>
