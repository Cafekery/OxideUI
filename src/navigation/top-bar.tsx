import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type TopBarProps = ComponentPropsWithRef<'header'> & {
  leading?: ReactNode
  trailing?: ReactNode
}

const TOP_BAR =
  'sticky top-0 z-[var(--z-top-bar)] flex h-[var(--top-bar-height)] shrink-0 items-center justify-between gap-3 border-default border-b bg-default px-4'

export function TopBar({ leading, trailing, children, className, ...rest }: TopBarProps) {
  return (
    <header className={cn(TOP_BAR, className)} {...rest}>
      {leading && <div className="flex shrink-0 items-center gap-2">{leading}</div>}
      <div className="flex min-w-0 flex-1 items-center gap-2">{children}</div>
      {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
    </header>
  )
}
