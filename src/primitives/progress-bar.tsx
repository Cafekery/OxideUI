import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type ProgressSize = 'sm' | 'base'

const TRACK = 'w-full overflow-hidden rounded-full bg-secondary'
const FILL = 'h-full rounded-full transition-[width] motion-reduce:transition-none'

const HEIGHT: Record<ProgressSize, string> = {
  sm: 'h-1',
  base: 'h-2',
}

/** The role and the `aria-value*` triplet are the contract, not caller-tunable —
 *  `rest` is spread before them so an injected attribute cannot win. */
type BarProps = Omit<
  ComponentPropsWithRef<'div'>,
  'children' | 'role' | 'aria-valuenow' | 'aria-valuemin' | 'aria-valuemax'
> & {
  value: number
  size?: ProgressSize
  label?: string
}

export type ProgressBarProps = BarProps

export function ProgressBar({
  value,
  size = 'base',
  label,
  className,
  ...rest
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))

  return (
    <div
      {...rest}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(TRACK, HEIGHT[size], className)}
    >
      <div className={cn(FILL, 'bg-accent-inverse')} style={{ width: `${percent}%` }} />
    </div>
  )
}

export type MeterBarProps = BarProps

/** A meter reads as consumption, not progress, so the fill escalates with the
 *  value instead of holding one colour. */
export function MeterBar({
  value,
  size = 'base',
  label,
  className,
  ...rest
}: MeterBarProps) {
  const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
  const fill =
    percent > 90
      ? 'bg-error-inverse'
      : percent >= 75
        ? 'bg-notice-inverse'
        : 'bg-accent-inverse'

  return (
    // biome-ignore lint/a11y/useSemanticElements: native <meter> paints its bar through vendor pseudo-elements, so the token track and threshold fill cannot be expressed on it
    <div
      {...rest}
      role="meter"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(TRACK, HEIGHT[size], className)}
    >
      <div className={cn(FILL, fill)} style={{ width: `${percent}%` }} />
    </div>
  )
}
