import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { type BreadcrumbItem, Breadcrumbs } from './breadcrumbs'

export type PageHeaderProps = Omit<
  ComponentPropsWithRef<'header'>,
  'title' | 'children'
> & {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-3', className)} {...rest}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="heading-md">{title}</h1>
          {description && <p className="text-secondary text-sans-14">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}
