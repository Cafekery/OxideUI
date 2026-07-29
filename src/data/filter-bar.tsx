import type { ComponentPropsWithRef } from 'react'
import { Close } from '../icons'
import { cn } from '../lib/cn'

export type FilterChip = {
  id: string
  label: string
  value: string
}

export type FilterBarProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  filters: FilterChip[]
  onRemove: (id: string) => void
  onClearAll?: () => void
}

export function FilterBar({
  filters,
  onRemove,
  onClearAll,
  className,
  ...rest
}: FilterBarProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)} {...rest}>
      <ul aria-label="Active filters" className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <li key={filter.id}>
            <button
              type="button"
              aria-label={`Remove filter ${filter.label}: ${filter.value}`}
              onClick={() => onRemove(filter.id)}
              className="flex items-center gap-1.5 rounded-lg border border-default bg-secondary px-2 py-1 text-mono-sm text-default transition-colors hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span className="text-tertiary">{filter.label}</span>
              {filter.value}
              <Close className="text-tertiary" />
            </button>
          </li>
        ))}
      </ul>
      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-lg px-2 py-1 text-mono-sm text-secondary transition-colors hover:bg-hover hover:text-default focus-visible:outline-2 focus-visible:outline-accent"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
