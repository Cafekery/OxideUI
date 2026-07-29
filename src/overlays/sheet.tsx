import { Dialog } from 'radix-ui'
import type { ComponentPropsWithRef, ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'
import { DIALOG_ACTIONS, DIALOG_PANE, DialogHeader } from './dialog-shell'

export type SheetSide = 'right' | 'left'

const SIDE: Record<SheetSide, string> = {
  right: 'right-0 border-l starting:translate-x-full',
  left: 'left-0 border-r starting:-translate-x-full',
}

const CONTENT =
  'fixed inset-y-0 z-[var(--z-side-modal)] flex w-[26rem] max-w-[calc(100vw-3rem)] flex-col border-default bg-raise shadow-modal transition-[opacity,translate] duration-200 ease-out starting:opacity-0'

/** `trigger` is what Radix restores focus to on close. Opening a sheet purely
 *  from state leaves the browser's focus wherever the user last put it. */
export type SheetProps = Omit<Dialog.DialogContentProps, 'title'> & {
  ref?: Ref<HTMLDivElement>
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  description?: ReactNode
  trigger?: ReactNode
  side?: SheetSide
  closeLabel?: string
}

export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  trigger,
  side = 'right',
  closeLabel = 'Close',
  className,
  children,
  ...rest
}: SheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger asChild>{trigger}</Dialog.Trigger> : null}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[var(--z-side-modal-overlay)] bg-scrim transition-opacity duration-200 starting:opacity-0" />
        <Dialog.Content className={cn(CONTENT, SIDE[side], className)} {...rest}>
          <DialogHeader title={title} description={description} closeLabel={closeLabel} />
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export type SheetBodyProps = ComponentPropsWithRef<'div'>

export const SheetBody = ({ className, ...rest }: SheetBodyProps) => (
  <div className={cn(DIALOG_PANE, className)} {...rest} />
)

export type SheetFooterProps = ComponentPropsWithRef<'div'>

export const SheetFooter = ({ className, ...rest }: SheetFooterProps) => (
  <div className={cn(DIALOG_ACTIONS, className)} {...rest} />
)
