import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SidebarProps = ComponentPropsWithRef<'nav'>

const SIDEBAR =
  'flex h-full w-[var(--sidebar-width)] shrink-0 flex-col gap-5 overflow-y-auto border-default border-r bg-default py-4 scroll-thin'

export function Sidebar({
  className,
  'aria-label': label = 'Main',
  ...rest
}: SidebarProps) {
  return <nav aria-label={label} className={cn(SIDEBAR, className)} {...rest} />
}

export type SidebarSectionProps = ComponentPropsWithRef<'div'> & { title?: ReactNode }

export function SidebarSection({
  title,
  children,
  className,
  ...rest
}: SidebarSectionProps) {
  return (
    <div className={cn('flex flex-col gap-0.5 px-2', className)} {...rest}>
      {title && <div className="px-2 pb-1 text-mono-xs text-tertiary">{title}</div>}
      {children}
    </div>
  )
}

export type SidebarFooterProps = ComponentPropsWithRef<'div'>

export function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return (
    <div
      className={cn(
        'mt-auto flex flex-col gap-0.5 border-default border-t px-2 pt-4',
        className,
      )}
      {...rest}
    />
  )
}
