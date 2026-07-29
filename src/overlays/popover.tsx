import { Popover as PopoverPrimitive } from 'radix-ui'
import type { ReactNode, Ref } from 'react'
import { cn } from '../lib/cn'

const CONTENT =
  'z-[var(--z-popover)] max-w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-default bg-raise p-3 text-sans-12 text-default shadow-menu origin-[var(--radix-popover-content-transform-origin)] transition-[opacity,scale] duration-100 ease-out starting:scale-95 starting:opacity-0'

export type PopoverProps = PopoverPrimitive.PopoverContentProps & {
  ref?: Ref<HTMLDivElement>
  trigger: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  arrow?: boolean
}

export function Popover({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  arrow = false,
  sideOffset = 6,
  collisionPadding = 8,
  className,
  children,
  ...rest
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(CONTENT, className)}
          {...rest}
        >
          {children}
          {arrow ? (
            <PopoverPrimitive.Arrow
              width={12}
              height={6}
              className="fill-[var(--surface-raise)]"
            />
          ) : null}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
