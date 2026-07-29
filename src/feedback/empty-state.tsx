import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type EmptyStateProps = ComponentPropsWithRef<'div'> & {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 px-6 py-12 text-center',
        className,
      )}
      {...rest}
    >
      {icon ? (
        <span aria-hidden className="mb-1 text-quaternary text-sans-28">
          {icon}
        </span>
      ) : null}
      <p className="text-default text-sans-semi-md">{title}</p>
      {description ? (
        <p className="max-w-prose text-sans-14 text-tertiary">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
