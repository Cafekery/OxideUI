import type { ComponentPropsWithRef } from 'react'
import { AlertTriangle } from '../icons'
import { Button } from '../primitives'
import { CenteredState, StateDescription, StateTitle } from './state-parts'

export type ErrorStateProps = ComponentPropsWithRef<'div'> & {
  title?: string
  description?: string
  error?: unknown
  showDetails?: boolean
  onRetry?: () => void
}

/** A thrown value may carry a query, a stack or a token, so it is only ever
 *  reachable through `showDetails` — never through the visible copy. */
function describeError(error: unknown): string {
  if (error instanceof Error) return error.stack ?? `${error.name}: ${error.message}`
  if (typeof error === 'string') return error
  try {
    return JSON.stringify(error, null, 2) ?? String(error)
  } catch {
    return 'This value could not be displayed.'
  }
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'This content could not be loaded. Try again in a moment.',
  error,
  showDetails = false,
  onRetry,
  ...rest
}: ErrorStateProps) {
  return (
    <CenteredState {...rest}>
      <AlertTriangle aria-hidden className="mb-1 text-error text-sans-28" />
      <StateTitle>{title}</StateTitle>
      <StateDescription>{description}</StateDescription>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry} size="sm" variant="secondary">
          Retry
        </Button>
      ) : null}
      {showDetails && error !== undefined ? (
        <details className="mt-6 w-full max-w-prose text-left">
          <summary className="cursor-pointer text-mono-xs text-quaternary">
            Technical detail
          </summary>
          <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-secondary p-3 text-mono-code text-secondary scroll-thin">
            {describeError(error)}
          </pre>
        </details>
      ) : null}
    </CenteredState>
  )
}
