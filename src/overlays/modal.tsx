import { Dialog } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'
import { DIALOG_ACTIONS, DIALOG_PANE, DialogHeader } from './dialog-shell'

export type ModalSize = 'sm' | 'base' | 'lg'

const SIZE: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  base: 'max-w-lg',
  lg: 'max-w-3xl',
}

const CONTENT =
  'fixed left-1/2 top-1/2 z-[var(--z-modal)] flex max-h-[calc(100dvh-6rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-default bg-raise shadow-modal transition-[opacity,scale] duration-150 ease-out starting:scale-[0.98] starting:opacity-0'

/** `trigger` is what Radix restores focus to on close. Opening a modal purely
 *  from state leaves the browser's focus wherever the user last put it. */
export type ModalProps = Omit<Dialog.DialogContentProps, 'title'> & {
  ref?: Ref<HTMLDivElement>
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  trigger?: ReactNode
  size?: ModalSize
  closeLabel?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  size = 'base',
  closeLabel = 'Close',
  className,
  children,
  ...rest
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-modal-overlay)] bg-scrim transition-opacity duration-150 starting:opacity-0" />
        <Dialog.Content className={cn(CONTENT, SIZE[size], className)} {...rest}>
          <DialogHeader title={title} description={description} closeLabel={closeLabel} />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export type ModalBodyProps = ComponentPropsWithRef<'div'>

export const ModalBody = ({ className, ...rest }: ModalBodyProps) => (
  <div className={cn(DIALOG_PANE, className)} {...rest} />
)

export type ModalFooterProps = ComponentPropsWithRef<'div'>

export const ModalFooter = ({ className, ...rest }: ModalFooterProps) => (
  <div className={cn(DIALOG_ACTIONS, className)} {...rest} />
)
