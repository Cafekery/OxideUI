import { cn } from '../lib/cn'
import { type DialogBaseProps, DialogShell } from './dialog-shell'

export type SheetSide = 'right' | 'left'

const SIDE: Record<SheetSide, string> = {
  right: 'right-0 border-l starting:translate-x-full',
  left: 'left-0 border-r starting:-translate-x-full',
}

const OVERLAY =
  'fixed inset-0 z-[var(--z-side-modal-overlay)] bg-scrim transition-opacity duration-200 starting:opacity-0'

const CONTENT =
  'fixed inset-y-0 z-[var(--z-side-modal)] flex w-[26rem] max-w-[calc(100vw-3rem)] flex-col border-default bg-raise shadow-modal transition-[opacity,translate] duration-200 ease-out starting:opacity-0'

export type SheetProps = DialogBaseProps & { side?: SheetSide }

export function Sheet({ side = 'right', className, ...rest }: SheetProps) {
  return (
    <DialogShell
      overlayClassName={OVERLAY}
      contentClassName={cn(CONTENT, SIDE[side], className)}
      {...rest}
    />
  )
}

export type {
  DialogActionsProps as SheetFooterProps,
  DialogPaneProps as SheetBodyProps,
} from './dialog-shell'
export { DialogActions as SheetFooter, DialogPane as SheetBody } from './dialog-shell'
