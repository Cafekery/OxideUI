import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

const COLUMNS: Record<1 | 2, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
}

export type PropertyListProps = ComponentPropsWithRef<'dl'> & {
  columns?: 1 | 2
}

export function PropertyList({ columns = 1, className, ...rest }: PropertyListProps) {
  return (
    <dl className={cn('grid gap-x-8 gap-y-4', COLUMNS[columns], className)} {...rest} />
  )
}

export type PropertyItemProps = ComponentPropsWithRef<'div'> & {
  label: ReactNode
}

export function PropertyItem({ label, children, className, ...rest }: PropertyItemProps) {
  return (
    <div className={cn('min-w-0', className)} {...rest}>
      <dt className="text-mono-xs text-tertiary">{label}</dt>
      <dd className="mt-1 min-w-0 break-words text-sans-14 text-default">{children}</dd>
    </div>
  )
}
