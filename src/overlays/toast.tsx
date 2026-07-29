import { type ReactNode, useSyncExternalStore } from 'react'
import { Toaster as SonnerToaster, toast as sonner } from 'sonner'
import { AlertTriangle, CircleCheck, Close, InfoCircle } from '../icons'
import { Spinner } from '../primitives'

const BASE =
  'flex w-full items-start gap-2.5 rounded-lg border p-3 shadow-toast bg-raise border-default'

/** The tints have to outrank the base surface, and neither class order nor
 *  declaration order decides that — Tailwind emits same-property utilities in
 *  alphabetical order, which would hand every toast to `bg-raise`. */
const TINT = {
  success: 'bg-accent-secondary! border-accent-secondary!',
  error: 'bg-error-secondary! border-error-secondary!',
  info: 'bg-info-secondary! border-info-secondary!',
  notice: 'bg-notice-secondary! border-notice!',
}

const subscribeTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}

const readTheme = () =>
  document.documentElement.dataset.theme === 'light'
    ? ('light' as const)
    : ('dark' as const)

export function Toaster() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'dark' as const)
  return (
    <SonnerToaster
      theme={theme}
      position="bottom-right"
      style={{ zIndex: 'var(--z-toast)' }}
      icons={{
        success: <CircleCheck className="size-4 text-accent" />,
        error: <Close className="size-4 text-error" />,
        info: <InfoCircle className="size-4 text-info" />,
        warning: <AlertTriangle className="size-4 text-notice" />,
        loading: <Spinner />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: BASE,
          icon: 'relative mt-px flex size-4 shrink-0 items-center justify-center',
          content: 'flex min-w-0 flex-1 flex-col gap-0.5',
          title: 'text-sans-semi-sm text-raise',
          description: 'text-sans-12 text-secondary',
          success: TINT.success,
          error: TINT.error,
          info: TINT.info,
          warning: TINT.notice,
        },
      }}
    />
  )
}

export type ToastId = number | string

export type ToastOptions = {
  description?: ReactNode
  duration?: number
  id?: ToastId
}

export type ToastPromiseMessages<T> = {
  loading: string
  success: string | ((value: T) => string)
  error: string | ((reason: unknown) => string)
}

export const toast = {
  success: (message: ReactNode, options?: ToastOptions) =>
    sonner.success(message, options),
  error: (message: ReactNode, options?: ToastOptions) => sonner.error(message, options),
  info: (message: ReactNode, options?: ToastOptions) => sonner.info(message, options),
  notice: (message: ReactNode, options?: ToastOptions) =>
    sonner.warning(message, options),
  loading: (message: ReactNode, options?: ToastOptions) =>
    sonner.loading(message, options),
  dismiss: (id?: ToastId) => {
    sonner.dismiss(id)
  },
  promise: <T,>(promise: Promise<T>, messages: ToastPromiseMessages<T>) => {
    sonner.promise(promise, messages)
  },
}
