import type { ComponentPropsWithRef } from 'react'
import { ChevronRight } from '../icons'
import { useLink } from '../lib/provider'

export type BreadcrumbItem = { label: string; to?: string }

export type BreadcrumbsProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  items: BreadcrumbItem[]
}

const MAX_VISIBLE = 4

function Crumb({ item, current }: { item: BreadcrumbItem; current: boolean }) {
  const Link = useLink()

  if (current)
    return (
      <span aria-current="page" className="text-default">
        {item.label}
      </span>
    )

  if (!item.to) return <span className="text-secondary">{item.label}</span>

  return (
    <Link to={item.to} className="text-secondary transition hover:text-default">
      {item.label}
    </Link>
  )
}

export function Breadcrumbs({ items, className, ...rest }: BreadcrumbsProps) {
  const trail: (BreadcrumbItem | null)[] =
    items.length > MAX_VISIBLE ? [...items.slice(0, 1), null, ...items.slice(-2)] : items

  return (
    <nav aria-label="Breadcrumb" className={className} {...rest}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sans-12">
        {trail.map((item, i) => (
          <li
            key={item ? `${item.to ?? ''}/${item.label}` : 'collapsed'}
            className="flex items-center gap-1.5"
          >
            {i > 0 && (
              <ChevronRight aria-hidden="true" className="shrink-0 text-quaternary" />
            )}
            {item ? (
              <Crumb item={item} current={i === trail.length - 1} />
            ) : (
              <span aria-hidden="true" className="text-tertiary">
                …
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
