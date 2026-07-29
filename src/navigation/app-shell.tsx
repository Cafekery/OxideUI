import { type ComponentPropsWithRef, type ReactNode, useId } from 'react'
import { cn } from '../lib/cn'

export type AppShellProps = ComponentPropsWithRef<'div'> & {
  sidebar: ReactNode
  topBar?: ReactNode
}

const SKIP =
  'sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:rounded-lg focus:bg-raise focus:px-3 focus:py-2 focus:text-mono-sm focus:text-default focus:shadow-modal'

export function AppShell({
  sidebar,
  topBar,
  children,
  className,
  ...rest
}: AppShellProps) {
  const mainId = useId()

  return (
    <div
      className={cn('relative flex h-dvh w-full overflow-hidden bg-default', className)}
      {...rest}
    >
      <a href={`#${mainId}`} className={SKIP}>
        Skip to content
      </a>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {topBar}
        {/* tabIndex is what lets the skip link move focus, not merely scroll. */}
        <main
          id={mainId}
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto p-6 scroll-thin"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
