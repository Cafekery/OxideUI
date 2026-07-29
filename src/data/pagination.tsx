import type { ComponentPropsWithRef } from 'react'
import { ChevronLeft, ChevronRight } from '../icons'
import { clamp } from '../lib/clamp'
import { cn } from '../lib/cn'
import { IconButton } from '../primitives'

export type PageSlot = number | 'ellipsis-start' | 'ellipsis-end'

const MAX_SLOTS = 7
const PAGE_SIZES = [10, 25, 50, 100]

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, offset) => from + offset)

/** Once `pageCount` exceeds MAX_SLOTS the result is always exactly MAX_SLOTS
 *  long, so the control keeps a stable width while the user pages through.
 *  Each ellipsis stands in for at least two pages, never one. */
export function paginationWindow(page: number, pageCount: number): PageSlot[] {
  if (pageCount < 1) return []
  if (pageCount <= MAX_SLOTS) return range(1, pageCount)

  const current = clamp(Math.trunc(page), 1, pageCount)
  const gapAfterFirst = current > 4
  const gapBeforeLast = current < pageCount - 3

  if (!gapAfterFirst) return [...range(1, 5), 'ellipsis-end', pageCount]
  if (!gapBeforeLast) return [1, 'ellipsis-start', ...range(pageCount - 4, pageCount)]
  return [
    1,
    'ellipsis-start',
    current - 1,
    current,
    current + 1,
    'ellipsis-end',
    pageCount,
  ]
}

const PageSizeSelect = ({
  value,
  onChange,
}: {
  value: number
  onChange: (pageSize: number) => void
}) => {
  const options = PAGE_SIZES.includes(value)
    ? PAGE_SIZES
    : [...PAGE_SIZES, value].sort((a, b) => a - b)

  return (
    <label className="flex items-center gap-1.5 text-tertiary">
      Rows
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-lg border border-default bg-raise px-1.5 py-0.5 text-mono-sm text-default focus-visible:outline-2 focus-visible:outline-accent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export type PaginationProps = Omit<ComponentPropsWithRef<'nav'>, 'children'> & {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (pageSize: number) => void
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange,
  className,
  ...rest
}: PaginationProps) {
  if (pageCount < 1) return null

  const current = clamp(Math.trunc(page), 1, pageCount)
  const slots = paginationWindow(current, pageCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center gap-3 text-mono-sm', className)}
      {...rest}
    >
      {pageSize !== undefined && onPageSizeChange && (
        <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
      )}
      <div className="flex items-center gap-1">
        <IconButton
          aria-label="Previous page"
          size="sm"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft />
        </IconButton>
        {slots.map((slot) =>
          typeof slot === 'number' ? (
            <button
              key={slot}
              type="button"
              aria-current={slot === current ? 'page' : undefined}
              onClick={() => onPageChange(slot)}
              className={cn(
                'min-w-6 rounded-lg px-1.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent',
                slot === current
                  ? 'bg-accent-secondary text-accent'
                  : 'text-secondary hover:bg-hover hover:text-default',
              )}
            >
              {slot}
            </button>
          ) : (
            <span key={slot} aria-hidden className="px-1 text-quaternary">
              …
            </span>
          ),
        )}
        <IconButton
          aria-label="Next page"
          size="sm"
          disabled={current >= pageCount}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight />
        </IconButton>
      </div>
    </nav>
  )
}
