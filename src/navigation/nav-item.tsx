import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { useLink } from '../lib/provider'

export type NavItemProps = {
  to: string
  children: ReactNode
  icon?: ReactNode
  badge?: ReactNode
  active?: boolean
  className?: string
}

const BASE =
  'inline-flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sans-14 transition'
const RESTING = 'text-secondary hover:bg-hover hover:text-default'
const ACTIVE = 'bg-accent text-accent'

export function NavItem({ to, children, icon, badge, active, className }: NavItemProps) {
  const Link = useLink()

  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={cn(BASE, active ? ACTIVE : RESTING, className)}
    >
      {icon && <span className="flex shrink-0 items-center">{icon}</span>}
      <span className="truncate">{children}</span>
      {badge && <span className="ml-auto flex shrink-0 items-center">{badge}</span>}
    </Link>
  )
}
