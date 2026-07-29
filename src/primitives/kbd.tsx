import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type KbdProps = ComponentPropsWithRef<'kbd'>

export function Kbd({ className, ...rest }: KbdProps) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-default bg-secondary px-1 text-mono-xs text-secondary',
        className,
      )}
      {...rest}
    />
  )
}
