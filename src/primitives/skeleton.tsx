import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'

export type SkeletonProps = ComponentPropsWithRef<'div'>

/** Carries no intrinsic size: every placeholder is shaped by the caller's
 *  `className`, since a baked-in height would fight it on class precedence. */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded bg-secondary motion-reduce:animate-none',
        className,
      )}
      {...rest}
    />
  )
}
