import type { ComponentPropsWithRef } from 'react'
import { cn } from '../lib/cn'
import { Spinner, type SpinnerSize } from './spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'notice'
export type ButtonSize = 'sm' | 'base'

const BASE =
  'relative inline-flex select-none items-center justify-center gap-2 rounded-lg text-mono-sm transition-colors active:translate-y-px motion-reduce:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:cursor-not-allowed'

/** `enabled:` guards the hover fill: `:hover` still matches a disabled button, and
 *  the disabled treatment dims the label only — the fill must stay put. */
const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-accent enabled:hover:bg-accent-hover disabled:text-accent-disabled',
  secondary: 'bg-secondary text-secondary enabled:hover:bg-hover disabled:text-disabled',
  ghost: 'bg-transparent text-secondary enabled:hover:bg-hover disabled:text-disabled',
  danger:
    'bg-destructive text-destructive enabled:hover:bg-error-hover disabled:text-destructive-disabled',
  notice:
    'bg-notice text-notice enabled:hover:bg-notice-hover disabled:text-notice-disabled',
}

const SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 px-3',
  base: 'h-10 px-4',
}

const SQUARE: Record<ButtonSize, string> = {
  sm: 'h-8 w-8',
  base: 'h-10 w-10',
}

const SPINNER: Record<ButtonSize, SpinnerSize> = {
  sm: 'sm',
  base: 'base',
}

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'base',
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner size={SPINNER[size]} className="absolute inset-0 m-auto" />
          <span className="invisible inline-flex items-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export type IconButtonProps = ComponentPropsWithRef<'button'> & {
  'aria-label': string
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function IconButton({
  variant = 'primary',
  size = 'base',
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANT[variant], SQUARE[size], className)}
      {...rest}
    >
      {loading ? <Spinner size={SPINNER[size]} /> : children}
    </button>
  )
}
