import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

/** Shared, internal shell and text atoms for the centred states — `EmptyState`
 *  and `ErrorState`. Not exported from the folder barrel: not public API. */
export function CenteredState({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
        className,
      )}
      {...rest}
    />
  )
}

export function StateTitle({ children }: { children: ReactNode }) {
  return <p className="text-default text-sans-semi-md">{children}</p>
}

export function StateDescription({ children }: { children: ReactNode }) {
  return <p className="max-w-prose text-sans-14 text-tertiary">{children}</p>
}
