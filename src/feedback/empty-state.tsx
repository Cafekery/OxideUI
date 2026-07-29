import type { ComponentPropsWithRef, ReactNode } from 'react'
import { CenteredState, StateDescription, StateTitle } from './state-parts'

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
  ...rest
}: EmptyStateProps) {
  return (
    <CenteredState {...rest}>
      {icon ? (
        <span aria-hidden className="mb-1 text-quaternary text-sans-28">
          {icon}
        </span>
      ) : null}
      <StateTitle>{title}</StateTitle>
      {description ? <StateDescription>{description}</StateDescription> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </CenteredState>
  )
}
