// ─── 火山引擎豆包 TTS 配置（V3 大模型 API）─────────────────
// 凭证从 .env 文件读取（Vite 环境变量），不上传到 GitHub
// 不填则自动降级到浏览器内置语音（Microsoft Yaoyao 等）
//
// 本地开发：在项目根目录创建 .env 文件，填入：
//   VITE_VOLCENGINE_TOKEN=你的API_Key
//
// 可选：通过环境变量切换 speaker
//   VITE_VOLCENGINE_SPEAKER=zh_female_qingxinnvsheng_mars_bigtts

export const VOLCENGINE_TTS_CONFIG = {
  // V3 API 只需 API Key（x-api-key），不需要 appid
  token: import.meta.env.VITE_VOLCENGINE_TOKEN || '',
  // 大模型 speaker ID（非旧版 BVxxx 格式）
  speaker: import.meta.env.VITE_VOLCENGINE_SPEAKER || 'zh_female_tianmeitaozi_mars_bigtts',
  // V3 资源 ID（固定）
  resourceId: 'volc.service_type.10029',
}
