import type { ReactNode } from 'react'

export function Canvas({
  viewport,
  children,
}: {
  viewport: number | null
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2 overflow-auto bg-default p-6 scroll-thin">
      {viewport !== null && (
        <span className="text-mono-xs text-tertiary">{viewport}px</span>
      )}
      <div
        className="min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-default bg-raise shadow-border"
        style={
          viewport === null ? undefined : { width: viewport, boxSizing: 'content-box' }
        }
      >
        {children}
      </div>
    </div>
  )
}
