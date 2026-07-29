import { Dialog } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode, Ref } from 'react'
import { Close } from '../icons'
import { cn } from '../lib/cn'

const DIALOG_PANE =
  'scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 text-sans-14 text-default'

const DIALOG_ACTIONS =
  'flex shrink-0 items-center justify-end gap-2 border-t border-secondary px-4 py-3'

export type DialogPaneProps = ComponentPropsWithRef<'div'>

export const DialogPane = ({ className, ...rest }: DialogPaneProps) => (
  <div className={cn(DIALOG_PANE, className)} {...rest} />
)

export type DialogActionsProps = ComponentPropsWithRef<'div'>

export const DialogActions = ({ className, ...rest }: DialogActionsProps) => (
  <div className={cn(DIALOG_ACTIONS, className)} {...rest} />
)

function DialogHeader({
  title,
  description,
  closeLabel,
}: {
  title: ReactNode
  description?: ReactNode
  closeLabel: string
}) {
  return (
    <div className="flex shrink-0 items-start gap-3 border-b border-secondary px-4 py-3">
      <div className="min-w-0 flex-1">
        <Dialog.Title className="text-sans-semi-md text-raise">{title}</Dialog.Title>
        {description ? (
          <Dialog.Description className="mt-1 text-sans-12 text-secondary">
            {description}
          </Dialog.Description>
        ) : null}
      </div>
      <Dialog.Close
        aria-label={closeLabel}
        className="-mr-1 rounded p-1 text-tertiary transition hover:bg-hover hover:text-default"
      >
        <Close className="size-4" />
      </Dialog.Close>
    </div>
  )
}

export type DialogBaseProps = Omit<Dialog.DialogContentProps, 'title'> & {
  ref?: Ref<HTMLDivElement>
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  /** What Radix restores focus to on close. Opening a dialog purely from state
   *  leaves the browser's focus wherever the user last put it. */
  trigger?: ReactNode
  closeLabel?: string
}

type DialogShellProps = Omit<DialogBaseProps, 'className'> & {
  overlayClassName: string
  contentClassName: string
}

export function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  closeLabel = 'Close',
  overlayClassName,
  contentClassName,
  children,
  ...rest
}: DialogShellProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClassName} />
        <Dialog.Content className={contentClassName} {...rest}>
          <DialogHeader title={title} description={description} closeLabel={closeLabel} />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
