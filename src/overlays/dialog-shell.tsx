import { Dialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { Close } from '../icons'

export const DIALOG_PANE =
  'scroll-thin min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 text-sans-14 text-default'

export const DIALOG_ACTIONS =
  'flex shrink-0 items-center justify-end gap-2 border-t border-secondary px-4 py-3'

export function DialogHeader({
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
