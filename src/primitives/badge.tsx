import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type BadgeVariant =
  | 'default'
  | 'accent'
  | 'success'
  | 'notice'
  | 'error'
  | 'info'
  | 'neutral'

export type BadgeSize = 'sm' | 'base'

/** Success is the one hue with no semantic surface — accent is swappable and would
 *  drag "success" along with it — so it pins the raw green scale per theme. */
const VARIANT: Record<BadgeVariant, string> = {
  default: 'bg-secondary text-default',
  accent: 'bg-accent text-accent',
  success: 'bg-green-200 text-green-800 light:bg-green-1200 light:text-green-500',
  notice: 'bg-notice text-notice',
  error: 'bg-error text-error',
  info: 'bg-info text-info',
  neutral: 'bg-tertiary text-tertiary',
}

const SIZE: Record<BadgeSize, string> = {
  sm: 'h-4 gap-1 px-1',
  base: 'h-5 gap-1 px-1.5',
}

export type BadgeProps = ComponentPropsWithRef<'span'> & {
  variant?: BadgeVariant
  size?: BadgeSize
}

export function Badge({
  variant = 'default',
  size = 'base',
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-sm text-mono-xs',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    />
  )
}
