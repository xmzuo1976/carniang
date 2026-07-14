<script setup lang="ts">
defineProps<{
  glow: boolean
  opacity: number
}>()
</script>

<template>
  <div class="cube-container relative" :class="{ 'cube-glowing': glow }">
    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70px] h-[8px] rounded-full"
         :class="glow ? 'bg-cyan-500/20 blur-md' : 'bg-black/30 blur-sm'"></div>
    <svg viewBox="0 0 100 120" class="w-[80px] h-[96px] md:w-[100px] md:h-[120px]">
      <defs>
        <linearGradient id="cubeFace" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1f2e"/><stop offset="50%" stop-color="#12161f"/><stop offset="100%" stop-color="#0d1018"/></linearGradient>
        <linearGradient id="cubeSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e2333"/><stop offset="100%" stop-color="#0a0e16"/></linearGradient>
        <linearGradient id="crackGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="rgba(100,180,255,0.08)"/><stop offset="100%" stop-color="rgba(100,180,255,0)"/></linearGradient>
      </defs>
      <polygon points="30,10 70,10 90,30 70,50 30,50 10,30" fill="url(#cubeFace)" stroke="rgba(100,180,255,0.15)" stroke-width="0.8"/>
      <polygon points="10,30 30,10 30,50 10,70" fill="url(#cubeSide)" stroke="rgba(100,180,255,0.1)" stroke-width="0.5"/>
      <polygon points="70,10 90,30 90,70 70,50" fill="url(#cubeSide)" stroke="rgba(100,180,255,0.1)" stroke-width="0.5"/>
      <line x1="40" y1="15" x2="55" y2="38" stroke="url(#crackGrad)" stroke-width="0.4"/>
      <line x1="55" y1="38" x2="48" y2="45" stroke="url(#crackGrad)" stroke-width="0.3"/>
      <line x1="60" y1="20" x2="75" y2="35" stroke="url(#crackGrad)" stroke-width="0.3"/>
      <polygon points="30,10 70,10 90,30 70,50 30,50 10,30" fill="rgba(0,200,255,0.05)" class="cube-glow-polygon"/>
    </svg>
  </div>
</template>

<style scoped>
.cube-container { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); transition: filter 0.5s ease; }
.cube-glowing { filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)) drop-shadow(0 0 20px rgba(0,180,255,0.15)); }
.cube-glowing .cube-glow-polygon { animation: breathe 2s ease-in-out infinite; }
@keyframes breathe { 0%, 100% { fill: rgba(0,200,255,0.03); } 50% { fill: rgba(0,200,255,0.12); } }
</style>