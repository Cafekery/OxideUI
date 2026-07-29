import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type SpinnerSize = 'sm' | 'base' | 'lg'

export type SpinnerProps = ComponentPropsWithRef<'svg'> & {
  size?: SpinnerSize
  label?: string
}

const SIZE: Record<SpinnerSize, string> = {
  sm: 'h-3 w-3',
  base: 'h-4 w-4',
  lg: 'h-6 w-6',
}

export function Spinner({
  size = 'base',
  label = 'Loading',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      role="status"
      aria-label={label}
      className={cn('animate-spin motion-reduce:animate-none', SIZE[size], className)}
      {...rest}
    >
      <circle cx="9" cy="9" r="7" opacity={0.25} />
      <path d="M9 2A7 7 0 0 1 16 9" />
    </svg>
  )
}
