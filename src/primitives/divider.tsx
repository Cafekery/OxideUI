import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type DividerOrientation = 'horizontal' | 'vertical'

/** `<hr>` already means separator, so the role is implicit. Each orientation names
 *  both edges it touches — `border-0` plus `border-t` would race on precedence. */
const ORIENTATION: Record<DividerOrientation, string> = {
  horizontal: 'w-full border-t',
  vertical: 'h-full border-t-0 border-l',
}

export type DividerProps = Omit<
  ComponentPropsWithRef<'hr'>,
  'role' | 'aria-orientation'
> & {
  orientation?: DividerOrientation
}

export function Divider({
  orientation = 'horizontal',
  className,
  ...rest
}: DividerProps) {
  return (
    <hr
      {...rest}
      aria-orientation={orientation}
      className={cn('border-secondary', ORIENTATION[orientation], className)}
    />
  )
}
