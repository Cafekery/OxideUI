import { DropdownMenu } from 'radix-ui'
import type { ReactNode, Ref } from 'react'
import { Check } from '../icons'
import { cn } from '../lib/cn'
import { Kbd } from '../primitives'

const CONTENT =
  'z-[var(--z-popover)] min-w-44 max-h-[var(--radix-dropdown-menu-content-available-height)] scroll-thin overflow-y-auto rounded-lg border border-default bg-raise p-1 shadow-menu origin-[var(--radix-dropdown-menu-content-transform-origin)] transition-[opacity,scale] duration-100 ease-out starting:scale-95 starting:opacity-0'

const ITEM =
  'flex cursor-default select-none items-center gap-2 rounded px-2 py-1.5 text-sans-12 outline-none data-[highlighted]:bg-hover data-[disabled]:pointer-events-none data-[disabled]:text-disabled'

export type MenuProps = DropdownMenu.DropdownMenuContentProps & {
  ref?: Ref<HTMLDivElement>
  trigger: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Menu({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  align = 'start',
  sideOffset = 6,
  collisionPadding = 8,
  className,
  children,
  ...rest
}: MenuProps) {
  return (
    <DropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(CONTENT, className)}
          {...rest}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export type MenuItemProps = DropdownMenu.DropdownMenuItemProps & {
  ref?: Ref<HTMLDivElement>
  icon?: ReactNode
  shortcut?: ReactNode
  destructive?: boolean
}

export const MenuItem = ({
  icon,
  shortcut,
  destructive = false,
  className,
  children,
  ...rest
}: MenuItemProps) => (
  <DropdownMenu.Item
    className={cn(ITEM, destructive ? 'text-error' : 'text-default', className)}
    {...rest}
  >
    {icon ? (
      <span className="flex size-4 shrink-0 items-center justify-center">{icon}</span>
    ) : null}
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {shortcut ? <Kbd className="ml-2 shrink-0 text-tertiary">{shortcut}</Kbd> : null}
  </DropdownMenu.Item>
)

export type MenuCheckboxItemProps = DropdownMenu.DropdownMenuCheckboxItemProps & {
  ref?: Ref<HTMLDivElement>
  shortcut?: ReactNode
}

export const MenuCheckboxItem = ({
  shortcut,
  className,
  children,
  ...rest
}: MenuCheckboxItemProps) => (
  <DropdownMenu.CheckboxItem className={cn(ITEM, 'text-default', className)} {...rest}>
    <span className="flex size-4 shrink-0 items-center justify-center">
      <DropdownMenu.ItemIndicator>
        <Check className="size-3.5 text-accent" />
      </DropdownMenu.ItemIndicator>
    </span>
    <span className="min-w-0 flex-1 truncate">{children}</span>
    {shortcut ? <Kbd className="ml-2 shrink-0 text-tertiary">{shortcut}</Kbd> : null}
  </DropdownMenu.CheckboxItem>
)

export type MenuSeparatorProps = DropdownMenu.DropdownMenuSeparatorProps & {
  ref?: Ref<HTMLDivElement>
}

export const MenuSeparator = ({ className, ...rest }: MenuSeparatorProps) => (
  <DropdownMenu.Separator
    className={cn('-mx-1 my-1 h-px bg-secondary', className)}
    {...rest}
  />
)

export type MenuLabelProps = DropdownMenu.DropdownMenuLabelProps & {
  ref?: Ref<HTMLDivElement>
}

export const MenuLabel = ({ className, ...rest }: MenuLabelProps) => (
  <DropdownMenu.Label
    className={cn('px-2 py-1.5 text-mono-xs text-quaternary', className)}
    {...rest}
  />
)
