# 车娘 CarNiang — 你的车，真的在看向你

> TRAE AI 创造力大赛 · 硬件交互赛道

车娘 CarNiang 是一款面向驾驶员的车载 AI 伴侣产品。通过座舱感知终端「赛博方块」采集五感数据，结合社交边界引擎和记忆系统，让 AI 真正「活在车里」。

## 在线体验

👉 [https://your-username.github.io/carniang-demo/](https://your-username.github.io/carniang-demo/)

## 本地运行

```bash
git clone https://github.com/your-username/carniang-demo.git
cd carniang-demo
npm install
npm run dev
```

访问 `http://localhost:5173`

## 语音配置（可选）

如需体验火山引擎豆包语音合成（替代浏览器默认语音），在项目根目录创建 `.env` 文件：

```
VITE_VOLCENGINE_TOKEN=你的API_Key
```

未配置时自动降级为浏览器内置语音，核心 11 段台词使用预生成 MP3 零延迟播放。

## 技术栈

- **Vue 3** + **Vite** + **TailwindCSS v4**
- **火山引擎大模型语音合成 V3**（豆包音色）
- 三引擎语音架构：预生成 MP3 → 火山引擎实时合成 → 浏览器 speechSynthesis
- 程序化生成背景音乐（numpy）

## 项目结构

```
carniang-demo/
├── public/
│   ├── audio/bgm.wav          # 背景音乐（循环）
│   ├── images/                 # 概念图、爆炸图、场景截图
│   └── voice/                  # 11 段预生成语音（MP3）
├── src/
│   ├── components/
│   │   ├── TeardownScene.vue   # 产品拆解主页（滚动式）
│   │   ├── AwakeningScene.vue  # 觉醒场景
│   │   ├── SensingScene.vue    # 感知场景
│   │   ├── SocialBoundaryScene.vue  # 社交边界场景
│   │   ├── MemoryScene.vue     # 记忆场景
│   │   ├── GirlSilhouette.vue  # 星瑶剪影
│   │   └── CubeElement.vue     # 赛博方块元素
│   ├── composables/
│   │   ├── useTTS.ts           # 三引擎语音系统
│   │   └── useBGM.ts           # 背景音乐控制
│   ├── scripts/
│   │   └── generate-voices.mjs # 语音批量生成脚本
│   ├── App.vue                 # 场景路由
│   ├── tts.config.ts           # 火山引擎 TTS 配置
│   └── main.ts
├── scripts/generate-bgm.py     # BGM 生成脚本
└── package.json
```

## 演示场景

| 场景 | 内容 |
|------|------|
| 产品拆解 | 9 模块滚动式产品拆解，含自动语音播报 |
| 觉醒 | 赛博方块通电，五感依次点亮，星瑶苏醒 |
| 感知 | 五感数据流向 AI，「她在听。她在看。她在感受。」 |
| 社交边界 | 独自驾驶 → 副驾加入 → 后排有儿童 |
| 记忆 | 两阶段记忆交互：建立 → 时间转场 → 回忆 |
| 终幕 | 「你换车，不换娘。」 |

## 许可

MIT