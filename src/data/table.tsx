import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type UIEvent,
  useState,
} from 'react'
import { ChevronDown, ChevronUp } from '../icons'
import { cn } from '../lib/cn'
import { Skeleton } from '../primitives'

export type { ColumnDef }

const ARIA_SORT = {
  asc: 'ascending',
  desc: 'descending',
  none: 'none',
} as const

const SKELETON_ROWS = [0, 1, 2, 3, 4]
const NESTED_CONTROL = 'a, button, input, select, textarea'

const fromNestedControl = (event: MouseEvent | KeyboardEvent) =>
  event.target instanceof Element && event.target.closest(NESTED_CONTROL) !== null

export type TableProps<T> = {
  data: T[]
  // biome-ignore lint/suspicious/noExplicitAny: TValue sits in both co- and contravariant positions on ColumnDef, so a mixed-value column array cannot be typed with unknown
  columns: ColumnDef<T, any>[]
  emptyState?: ReactNode
  loading?: boolean
  onRowClick?: (row: T) => void
  pinFirstColumn?: boolean
  getRowId?: (row: T, index: number) => string
  className?: string
}

export function Table<T>({
  data,
  columns,
  emptyState = 'No results',
  loading = false,
  onRowClick,
  pinFirstColumn = false,
  getRowId,
  className,
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [atStart, setAtStart] = useState(true)

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows
  const leafColumns = table.getVisibleLeafColumns()

  return (
    <div
      className={cn('overflow-auto scroll-thin', className)}
      onScroll={
        pinFirstColumn
          ? (event: UIEvent<HTMLDivElement>) =>
              setAtStart(event.currentTarget.scrollLeft <= 0)
          : undefined
      }
    >
      <table
        aria-busy={loading}
        data-at-start={pinFirstColumn ? String(atStart) : undefined}
        className={cn(
          'w-full border-separate border-spacing-0',
          pinFirstColumn && 'table-pinned',
        )}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortable = header.column.getCanSort()
                const sorted = header.column.getIsSorted()
                const content = header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())

                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    aria-sort={sortable ? ARIA_SORT[sorted || 'none'] : undefined}
                    className="sticky top-0 z-20 border-b border-default bg-default px-3 py-2 text-left text-mono-xs text-tertiary"
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1.5 text-mono-xs text-tertiary transition-colors hover:text-default focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        {content}
                        {sorted === 'asc' ? (
                          <ChevronUp className="text-default" />
                        ) : (
                          <ChevronDown
                            className={sorted ? 'text-default' : 'text-quaternary'}
                          />
                        )}
                      </button>
                    ) : (
                      content
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {loading &&
            SKELETON_ROWS.map((slot) => (
              <tr key={slot}>
                {leafColumns.map((column) => (
                  <td key={column.id} className="border-b border-secondary px-3 py-2">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}

          {!loading && rows.length === 0 && (
            <tr>
              <td
                colSpan={leafColumns.length}
                className="px-3 py-10 text-center text-sans-14 text-secondary"
              >
                {emptyState}
              </td>
            </tr>
          )}

          {/* A row that navigates is a button, not a row with a click handler.
              Dropping role/tabIndex/onKeyDown here leaves it mouse-only. */}
          {!loading &&
            rows.map((row) => (
              <tr
                key={row.id}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={
                  onRowClick &&
                  ((event: MouseEvent<HTMLTableRowElement>) => {
                    if (!fromNestedControl(event)) onRowClick(row.original)
                  })
                }
                onKeyDown={
                  onRowClick &&
                  ((event: KeyboardEvent<HTMLTableRowElement>) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return
                    if (fromNestedControl(event)) return
                    event.preventDefault()
                    onRowClick(row.original)
                  })
                }
                className={cn(
                  'text-sans-14 text-default',
                  !pinFirstColumn && 'hover:bg-hover',
                  onRowClick && 'cursor-pointer focus-visible:outline-none',
                  onRowClick && !pinFirstColumn && 'focus-visible:bg-accent-secondary',
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-b border-secondary px-3 py-2 align-middle"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
