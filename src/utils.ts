/**
 * 工具函数 —— delay & typeText
 */

/** Promise 化的延迟 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 逐字打字机效果
 * @param ref   目标 Ref<string>，文字会被逐步写入
 * @param text  要打出的完整文本
 * @param charInterval  每个字符的间隔 (ms)
 * @param pauseInterval  句间/段间停顿 (ms)
 * @param options  可选，{ onSpeak?: (segment: string) => Promise<void> }
 */
export async function typeText(
  ref: { value: string },
  text: string,
  charInterval: number,
  pauseInterval: number,
  options?: { onSpeak?: (segment: string) => Promise<void> },
): Promise<void> {
  ref.value = ''
  let segBuf = ''

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    ref.value += ch
    segBuf += ch

    let wait = charInterval
    if ('。！？'.includes(ch)) wait = pauseInterval * 2.5
    else if ('……'.includes(ch)) wait = pauseInterval * 3
    else if ('，；、'.includes(ch)) wait = pauseInterval
    else if (ch === '\n') wait = pauseInterval * 2

    await delay(wait)

    if (options?.onSpeak && '。！？\n'.includes(ch)) {
      const segment = segBuf
      segBuf = ''
      try { await options.onSpeak(segment) } catch { /* ignore */ }
    }
  }

  if (options?.onSpeak && segBuf.trim()) {
    try { await options.onSpeak(segBuf) } catch { /* ignore */ }
  }
}
