import { Tooltip as TooltipPrimitive } from 'radix-ui'
import type { ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'

const CONTENT =
  'pointer-events-none z-[var(--z-popover)] max-w-64 rounded bg-inverse px-2 py-1 text-sans-12 text-inverse shadow-tooltip origin-[var(--radix-tooltip-content-transform-origin)] transition-[opacity,scale] duration-75 ease-out starting:scale-95 starting:opacity-0'

export const TooltipProvider = TooltipPrimitive.Provider
export type TooltipProviderProps = TooltipPrimitive.TooltipProviderProps

export type TooltipProps = Omit<TooltipPrimitive.TooltipContentProps, 'content'> & {
  ref?: Ref<HTMLDivElement>
  content: ReactNode
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
}

export function Tooltip({
  content,
  children,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration = 200,
  sideOffset = 5,
  collisionPadding = 8,
  className,
  ...rest
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
    >
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(CONTENT, className)}
          {...rest}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
