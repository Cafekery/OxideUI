const TEXT_FIELD = /^(?:INPUT|TEXTAREA|SELECT)$/

/** True when a bare keystroke belongs to a text field rather than to the
 *  gallery's shortcuts.
 *
 *  Duck-typed rather than `instanceof HTMLElement`, because the `/` shortcut is
 *  also read out of the preview iframe: its elements come from that frame's
 *  realm, where the top window's `HTMLElement` never matches. */
export const isTypingTarget = (target: unknown): boolean => {
  if (typeof target !== 'object' || target === null) return false
  const el = target as { tagName?: unknown; isContentEditable?: unknown }
  if (typeof el.tagName !== 'string') return false
  return TEXT_FIELD.test(el.tagName) || el.isContentEditable === true
}
