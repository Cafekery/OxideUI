import { cn } from '../lib/cn'
import { type DialogBaseProps, DialogShell } from './dialog-shell'

export type ModalSize = 'sm' | 'base' | 'lg'

const SIZE: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  base: 'max-w-lg',
  lg: 'max-w-3xl',
}

const OVERLAY =
  'fixed inset-0 z-[var(--z-modal-overlay)] bg-scrim transition-opacity duration-150 starting:opacity-0'

const CONTENT =
  'fixed left-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-default bg-raise shadow-modal transition-[opacity,scale] duration-150 ease-out starting:scale-[0.98] starting:opacity-0'

export type ModalProps = DialogBaseProps & { size?: ModalSize }

export function Modal({ size = 'base', className, ...rest }: ModalProps) {
  return (
    <DialogShell
      overlayClassName={OVERLAY}
      contentClassName={cn(CONTENT, SIZE[size], className)}
      {...rest}
    />
  )
}

export type {
  DialogActionsProps as ModalFooterProps,
  DialogPaneProps as ModalBodyProps,
} from './dialog-shell'
export { DialogActions as ModalFooter, DialogPane as ModalBody } from './dialog-shell'
