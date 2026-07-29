import { useEffect, useState } from 'react'

export type ChartTheme = {
  grid: string
  axis: string
  cursor: string
  series: readonly string[]
}

const SERIES_TOKENS = [
  '--content-accent',
  '--content-info',
  '--content-accent-alt',
  '--content-notice',
  '--content-error',
] as const

/** Charts paint SVG attributes, which cannot reference a CSS variable that has
 *  not resolved yet. `currentColor` inherits the container's text colour so a
 *  server-rendered chart is still legible instead of black-on-black. */
const UNRESOLVED = 'currentColor'

const FALLBACK: ChartTheme = {
  grid: UNRESOLVED,
  axis: UNRESOLVED,
  cursor: UNRESOLVED,
  series: SERIES_TOKENS.map(() => UNRESOLVED),
}

const readTheme = (): ChartTheme => {
  if (typeof window === 'undefined') return FALLBACK

  const style = getComputedStyle(document.documentElement)
  const token = (name: string) => style.getPropertyValue(name).trim() || UNRESOLVED

  return {
    grid: token('--stroke-tertiary'),
    axis: token('--content-tertiary'),
    cursor: token('--surface-hover'),
    series: SERIES_TOKENS.map(token),
  }
}

/** Resolved token colours for chart internals, re-read whenever the document
 *  theme flips so charts restyle in place rather than remounting. */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return theme
}
