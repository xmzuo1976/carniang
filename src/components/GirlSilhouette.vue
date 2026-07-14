<script setup lang="ts">
defineProps<{
  opacity: number
  eyeOpen: boolean
  blinking: boolean
  tilt: boolean
}>()
</script>

<template>
  <div class="girl-wrapper" :class="{ 'is-tilt': tilt }">
    <svg viewBox="0 0 300 520" class="girl-svg"
         style="filter: drop-shadow(0 0 30px rgba(0,180,255,0.2))">
      <defs>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(200,215,245,0.5)"/>
          <stop offset="100%" stop-color="rgba(160,180,220,0.15)"/>
        </linearGradient>
        <radialGradient id="irisGradL" cx="45%" cy="40%">
          <stop offset="0%" stop-color="rgba(255,210,100,0.95)"/>
          <stop offset="50%" stop-color="rgba(220,160,50,0.75)"/>
          <stop offset="100%" stop-color="rgba(140,90,30,0.5)"/>
        </radialGradient>
        <radialGradient id="irisGradR" cx="45%" cy="40%">
          <stop offset="0%" stop-color="rgba(255,210,100,0.7)"/>
          <stop offset="50%" stop-color="rgba(220,160,50,0.5)"/>
          <stop offset="100%" stop-color="rgba(140,90,30,0.3)"/>
        </radialGradient>
        <linearGradient id="hpMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(160,175,200,0.45)"/>
          <stop offset="100%" stop-color="rgba(110,120,145,0.2)"/>
        </linearGradient>
        <linearGradient id="jacketGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(230,228,220,0.18)"/>
          <stop offset="100%" stop-color="rgba(200,198,190,0.06)"/>
        </linearGradient>
        <filter id="ledGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="eyeGlow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <!-- ═══ 后发（长直发过肩）═══ -->
      <path d="M105 75 Q85 80 78 110 Q70 160 68 220 Q66 280 72 340 Q75 370 80 390
               L95 390 Q90 360 88 320 Q86 260 88 200 Q90 150 98 115 Q102 95 108 85 Z"
            fill="url(#hairGrad)" stroke="rgba(180,200,240,0.3)" stroke-width="0.8"/>
      <path d="M195 75 Q215 80 222 110 Q230 160 232 220 Q234 280 228 340 Q225 370 220 390
               L205 390 Q210 360 212 320 Q214 260 212 200 Q210 150 202 115 Q198 95 192 85 Z"
            fill="url(#hairGrad)" stroke="rgba(180,200,240,0.3)" stroke-width="0.8"/>
      <path d="M115 80 Q100 95 95 130 Q88 180 86 240 Q85 290 90 350 L100 350
               Q96 290 97 240 Q98 180 105 135 Q110 105 118 88 Z"
            fill="rgba(190,205,235,0.12)" stroke="none"/>
      <path d="M185 80 Q200 95 205 130 Q212 180 214 240 Q215 290 210 350 L200 350
               Q204 290 203 240 Q202 180 195 135 Q190 105 182 88 Z"
            fill="rgba(190,205,235,0.12)" stroke="none"/>

      <!-- ═══ 身体/衣服 ═══ -->
      <path d="M130 165 L125 185 Q120 200 118 220 L118 260 L182 260 L182 220 Q180 200 175 185 L170 165 Z"
            fill="rgba(30,35,55,0.25)" stroke="rgba(100,115,145,0.2)" stroke-width="0.6"/>
      <path d="M130 155 Q128 158 127 165 L127 175 Q127 178 130 178 L170 178 Q173 178 173 175 L173 165 Q172 158 170 155 Z"
            fill="rgba(35,42,60,0.3)" stroke="rgba(120,130,160,0.22)" stroke-width="0.6"/>
      <path d="M118 178 Q105 182 88 192 Q72 204 65 220 Q60 235 62 250
               L65 310 Q68 360 75 400 L80 430 L220 430 L225 400 Q232 360 235 310 L238 250
               Q240 235 235 220 Q228 204 212 192 Q195 182 182 178 Z"
            fill="url(#jacketGrad)" stroke="rgba(210,215,230,0.18)" stroke-width="0.7"/>
      <line x1="150" y1="178" x2="148" y2="400"
            stroke="rgba(210,215,230,0.14)" stroke-width="0.8" stroke-dasharray="3,2"/>
      <path d="M130 178 L148 210 L150 210 L170 178"
            fill="none" stroke="rgba(210,215,230,0.22)" stroke-width="0.7"/>

      <!-- 左肩甲 -->
      <path d="M88 192 Q72 196 60 208 Q50 220 48 235 Q47 248 52 255
               L62 258 Q58 248 60 238 Q62 225 72 215 Q82 207 95 200 Z"
            fill="rgba(100,115,140,0.2)" stroke="rgba(160,175,200,0.3)" stroke-width="0.8"/>
      <path d="M55 225 Q65 218 78 212" fill="none" stroke="rgba(160,175,200,0.2)" stroke-width="0.6"/>
      <path d="M52 240 Q62 233 75 228" fill="none" stroke="rgba(160,175,200,0.2)" stroke-width="0.6"/>
      <circle cx="65" cy="222" r="1.8" fill="rgba(160,175,200,0.35)"/>
      <circle cx="58" cy="235" r="1.8" fill="rgba(160,175,200,0.35)"/>
      <path d="M62 215 Q68 222 65 232 Q62 242 68 250"
            fill="none" stroke="rgba(0,210,255,0.45)" stroke-width="0.9" filter="url(#ledGlow)">
        <animate attributeName="stroke-opacity" values="0.45;0.75;0.45" dur="3s" repeatCount="indefinite"/>
      </path>

      <!-- 右肩 -->
      <path d="M212 192 Q228 196 240 208 Q250 220 252 235 Q253 248 248 255
               L238 258 Q242 248 240 238 Q238 225 228 215 Q218 207 205 200 Z"
            fill="rgba(220,218,210,0.1)" stroke="rgba(210,215,230,0.18)" stroke-width="0.7"/>
      <path d="M238 215 Q232 222 235 232 Q238 242 232 250"
            fill="none" stroke="rgba(255,150,70,0.35)" stroke-width="0.9" filter="url(#ledGlow)">
        <animate attributeName="stroke-opacity" values="0.35;0.6;0.35" dur="3.5s" repeatCount="indefinite"/>
      </path>

      <!-- 袖口发光 -->
      <line x1="55" y1="295" x2="75" y2="295" stroke="rgba(0,210,255,0.4)" stroke-width="1.5" stroke-linecap="round">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite"/>
      </line>
      <line x1="55" y1="300" x2="75" y2="300" stroke="rgba(0,210,255,0.25)" stroke-width="0.8"/>
      <line x1="225" y1="295" x2="245" y2="295" stroke="rgba(255,150,70,0.4)" stroke-width="1.5" stroke-linecap="round">
        <animate attributeName="opacity" values="0.4;0.65;0.4" dur="4s" repeatCount="indefinite" begin="1s"/>
      </line>
      <line x1="225" y1="300" x2="245" y2="300" stroke="rgba(255,150,70,0.25)" stroke-width="0.8"/>

      <!-- ═══ 颈部 ═══ -->
      <path d="M138 148 Q137 155 135 165 L135 175 L165 175 L165 165 Q163 155 162 148"
            fill="rgba(220,205,190,0.1)" stroke="rgba(210,195,175,0.2)" stroke-width="0.6"/>

      <!-- ═══ 头部 ═══ -->
      <path d="M115 80 Q110 95 108 115 Q106 135 110 150 Q115 165 130 172
               Q142 176 155 172 Q168 165 172 150 Q176 135 174 115 Q172 95 167 80
               Q155 68 142 66 Q128 68 115 80 Z"
            fill="rgba(235,215,200,0.12)" stroke="rgba(215,200,180,0.65)" stroke-width="1.1"/>

      <!-- 耳朵 -->
      <path d="M110 100 Q105 95 103 102 Q101 112 106 118 Q109 115 110 108 Z"
            fill="rgba(225,205,190,0.06)" stroke="rgba(210,195,175,0.2)" stroke-width="0.5"/>
      <path d="M172 100 Q177 95 179 102 Q181 112 176 118 Q173 115 172 108 Z"
            fill="rgba(225,205,190,0.06)" stroke="rgba(210,195,175,0.2)" stroke-width="0.5"/>

      <!-- ═══ 五官 ═══ -->
      <!-- 眉毛 -->
      <path d="M118 92 Q128 84 143 89.5" fill="none" stroke="rgba(200,210,235,0.75)" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M162 89.5 Q172 84 181 92" fill="none" stroke="rgba(200,210,235,0.6)" stroke-width="1.2" stroke-linecap="round"/>

      <!-- 左眼（大 anime 眼） -->
      <g class="eye-left" :class="{ open: eyeOpen, blink: blinking }">
        <!-- 上眼睑（粗弧线） -->
        <path d="M117 100 Q130 91 145 100" fill="none" stroke="rgba(200,210,240,0.85)" stroke-width="1.8" stroke-linecap="round"/>
        <!-- 下眼睑 -->
        <path d="M120 106 Q131 114 143 106" fill="none" stroke="rgba(200,210,240,0.4)" stroke-width="0.8"/>
        <!-- 眼白 -->
        <ellipse cx="131" cy="103" rx="12.5" ry="5.8" fill="rgba(230,235,250,0.15)"/>
        <!-- 虹膜 -->
        <circle v-if="eyeOpen" cx="131" cy="103" r="5.5" fill="url(#irisGradL)" filter="url(#eyeGlow)">
          <animate attributeName="r" values="5.5;5.8;5.5" dur="4s" repeatCount="indefinite"/>
        </circle>
        <!-- 瞳孔 -->
        <circle v-if="eyeOpen" cx="131" cy="103" r="2.5" fill="rgba(25,20,15,0.8)"/>
        <!-- 高光（大） -->
        <circle v-if="eyeOpen" cx="133.5" cy="100.5" r="2" fill="rgba(255,255,255,0.85)"/>
        <!-- 高光（小） -->
        <circle v-if="eyeOpen" cx="128" cy="105.5" r="1.2" fill="rgba(255,255,255,0.5)"/>
        <!-- 上睫毛 -->
        <path d="M117 100 L114 96" stroke="rgba(200,210,240,0.45)" stroke-width="0.7" stroke-linecap="round"/>
        <path d="M121 96 L120 92" stroke="rgba(200,210,240,0.4)" stroke-width="0.7" stroke-linecap="round"/>
        <path d="M126 94 L125.5 90" stroke="rgba(200,210,240,0.4)" stroke-width="0.7" stroke-linecap="round"/>
      </g>

      <!-- 右眼（3/4 侧面） -->
      <g class="eye-right" :class="{ open: eyeOpen, blink: blinking }">
        <path d="M159 100 Q169 95 180 100" fill="none" stroke="rgba(200,210,240,0.55)" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M161 104 Q169 110 178 104" fill="none" stroke="rgba(200,210,240,0.28)" stroke-width="0.7"/>
        <ellipse cx="169" cy="102" rx="9" ry="4.5" fill="rgba(230,235,250,0.1)"/>
        <circle v-if="eyeOpen" cx="169" cy="102" r="4" fill="url(#irisGradR)">
          <animate attributeName="r" values="4;4.3;4" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle v-if="eyeOpen" cx="169" cy="102" r="1.8" fill="rgba(25,20,15,0.6)"/>
        <circle v-if="eyeOpen" cx="171" cy="100" r="1.3" fill="rgba(255,255,255,0.6)"/>
      </g>

      <!-- 鼻子 -->
      <path d="M148 115 Q145.5 121 148 125" fill="none" stroke="rgba(215,200,180,0.4)" stroke-width="0.7"/>

      <!-- 嘴巴 -->
      <path d="M138 132 Q148 138 158 132" fill="none" stroke="rgba(225,190,170,0.5)" stroke-width="1" stroke-linecap="round"/>
      <path d="M141 133.5 Q148 136 155 133.5" fill="rgba(225,160,140,0.12)" stroke="none"/>

      <!-- ═══ 前层头发 ═══ -->
      <path d="M112 78 Q125 58 150 56 Q175 58 188 78 Q178 64 150 60 Q125 64 112 78 Z"
            fill="rgba(200,212,240,0.15)" stroke="rgba(185,200,235,0.4)" stroke-width="0.8"/>
      <!-- 刘海主体 -->
      <path d="M108 82 Q112 68 128 62 Q140 58 148 60
               L145 80 Q138 74 130 77 Q120 82 115 90 Z"
            fill="rgba(200,212,240,0.18)" stroke="rgba(185,200,235,0.45)" stroke-width="0.8"/>
      <!-- 左侧长刘海 -->
      <path d="M108 82 Q103 92 101 108 Q99 122 103 132
               Q106 125 107 114 Q108 102 110 92 Z"
            fill="rgba(200,212,240,0.14)" stroke="rgba(185,200,235,0.4)" stroke-width="0.8"/>
      <!-- 右侧短刘海 -->
      <path d="M165 66 Q176 70 183 82 Q178 75 170 71 Z"
            fill="rgba(200,212,240,0.1)" stroke="rgba(185,200,235,0.25)" stroke-width="0.6"/>
      <!-- 碎发 -->
      <path d="M125 63 Q128 72 126 80" fill="none" stroke="rgba(185,200,235,0.3)" stroke-width="0.6"/>
      <path d="M135 60 Q136 69 134 78" fill="none" stroke="rgba(185,200,235,0.25)" stroke-width="0.6"/>
      <path d="M155 61 Q154 70 156 80" fill="none" stroke="rgba(185,200,235,0.25)" stroke-width="0.6"/>

      <!-- 侧发 -->
      <path d="M108 85 Q99 102 95 132 Q91 168 89 205 Q88 225 91 245
               L100 245 Q98 225 99 205 Q100 175 103 142 Q106 118 110 98 Z"
            fill="rgba(195,208,235,0.1)" stroke="rgba(185,200,235,0.3)" stroke-width="0.7"/>
      <path d="M189 85 Q195 102 197 128 Q199 158 197 188
               L191 188 Q193 158 192 132 Q191 112 187 98 Z"
            fill="rgba(195,208,235,0.08)" stroke="rgba(185,200,235,0.25)" stroke-width="0.6"/>
      <path d="M103 115 Q99 145 97 180" fill="none" stroke="rgba(185,200,235,0.15)" stroke-width="0.5"/>
      <path d="M195 115 Q197 140 196 170" fill="none" stroke="rgba(185,200,235,0.12)" stroke-width="0.5"/>

      <!-- ═══ 头戴耳机 ═══ -->
      <path d="M95 85 Q120 50 155 48 Q182 50 202 68"
            fill="none" stroke="rgba(165,175,200,0.4)" stroke-width="3" stroke-linecap="round"/>
      <path d="M118 54 Q140 48 160 50"
            fill="none" stroke="rgba(140,150,175,0.22)" stroke-width="5" stroke-linecap="round"/>

      <!-- 左耳罩 -->
      <ellipse cx="90" cy="108" rx="24" ry="30"
               fill="url(#hpMetal)" stroke="rgba(170,180,205,0.35)" stroke-width="1"/>
      <ellipse cx="90" cy="108" rx="17" ry="22"
               fill="rgba(35,42,65,0.25)" stroke="rgba(150,160,185,0.2)" stroke-width="0.6"/>
      <circle cx="90" cy="108" r="13"
              fill="none" stroke="rgba(0,220,255,0.6)" stroke-width="1.5" filter="url(#ledGlow)">
        <animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="90" cy="108" r="7" fill="none" stroke="rgba(0,220,255,0.25)" stroke-width="0.7"/>
      <circle cx="90" cy="108" r="2.5" fill="rgba(0,220,255,0.35)">
        <animate attributeName="opacity" values="0.35;0.65;0.35" dur="3s" repeatCount="indefinite"/>
      </circle>
      <rect x="108" y="95" width="7" height="12" rx="2.5" fill="rgba(150,160,185,0.25)" stroke="rgba(160,170,195,0.15)" stroke-width="0.5"/>

      <!-- 右耳罩 -->
      <ellipse cx="198" cy="108" rx="24" ry="30"
               fill="url(#hpMetal)" stroke="rgba(170,180,205,0.3)" stroke-width="1"/>
      <ellipse cx="198" cy="108" rx="17" ry="22"
               fill="rgba(35,42,65,0.2)" stroke="rgba(150,160,185,0.18)" stroke-width="0.6"/>
      <circle cx="198" cy="108" r="13"
              fill="none" stroke="rgba(0,220,255,0.5)" stroke-width="1.5" filter="url(#ledGlow)">
        <animate attributeName="stroke-opacity" values="0.5;0.85;0.5" dur="3s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
      <circle cx="198" cy="108" r="7" fill="none" stroke="rgba(0,220,255,0.2)" stroke-width="0.7"/>
      <circle cx="198" cy="108" r="2.5" fill="rgba(0,220,255,0.3)">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
      <rect x="185" y="95" width="7" height="12" rx="2.5" fill="rgba(150,160,185,0.2)" stroke="rgba(160,170,195,0.12)" stroke-width="0.5"/>

      <!-- HUD -->
      <g v-if="eyeOpen" class="hud" opacity="0.55">
        <rect x="94" y="84" width="20" height="14" rx="1.5" fill="none" stroke="rgba(0,220,255,0.5)" stroke-width="0.5"/>
        <line x1="96" y1="88.5" x2="112" y2="88.5" stroke="rgba(0,220,255,0.35)" stroke-width="0.4"/>
        <line x1="96" y1="92" x2="108" y2="92" stroke="rgba(0,220,255,0.25)" stroke-width="0.4"/>
        <animate attributeName="opacity" values="0.55;0.25;0.55" dur="5s" repeatCount="indefinite"/>
      </g>

      <!-- 方向盘 -->
      <path d="M35 385 Q150 425 265 385" fill="none" stroke="rgba(100,180,255,0.1)" stroke-width="1.2"/>
      <path d="M55 400 Q150 430 245 400" fill="none" stroke="rgba(100,180,255,0.06)" stroke-width="0.8"/>
    </svg>
  </div>
</template>

<style scoped>
.girl-wrapper { transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1); }
.girl-wrapper.is-tilt { transform: rotate(-3deg) translateX(-4px); }
.girl-svg { width: 200px; height: 347px; }
@media (min-width: 768px) { .girl-svg { width: 260px; height: 451px; } }

.eye-left, .eye-right { transition: all 0.15s ease; }
.eye-left ellipse, .eye-right ellipse { transition: all 0.1s ease; }
.eye-left.blink ellipse:first-of-type,
.eye-right.blink ellipse:first-of-type { ry: 0.8 !important; }
.eye-left.blink circle, .eye-right.blink circle { opacity: 0 !important; }
.eye-left.open circle:first-of-type { animation: irisPulse 4s ease-in-out infinite; }
@keyframes irisPulse {
  0%, 100% { filter: drop-shadow(0 0 3px rgba(255,190,60,0.4)); }
  50% { filter: drop-shadow(0 0 10px rgba(255,190,60,0.7)); }
}
.hud { transition: opacity 0.3s ease; }
</style>