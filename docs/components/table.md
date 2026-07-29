# Table

The house data table: a typed wrapper over headless TanStack Table that owns the markup,
the sort affordances, and the loading and empty states. Reach for it whenever a list of
records needs columns; drop to TanStack directly only if you need grouping, virtualisation,
or row selection.

```tsx
import { Table, type ColumnDef } from '@cafekery/oxide-ui'

type Instance = { name: string; state: string; vcpu: number }

const columns: ColumnDef<Instance, string | number>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'vcpu', header: 'vCPU' },
]

<Table data={instances} columns={columns} onRowClick={(row) => open(row.name)} />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `data` | `T[]` | — | Row objects. `T` is inferred from here. |
| `columns` | `ColumnDef<T, any>[]` | — | TanStack column defs. Re-exported so you don't need a direct TanStack import. |
| `emptyState` | `ReactNode` | `'No results'` | Rendered in a full-width cell when `data` is empty. |
| `loading` | `boolean` | `false` | Swaps the body for skeleton rows and sets `aria-busy`. |
| `onRowClick` | `(row: T) => void` | — | Makes each row an activatable control. Receives the original row object. |
| `pinFirstColumn` | `boolean` | `false` | Sticks the first column while the rest scrolls horizontally. |
| `getRowId` | `(row: T, index: number) => string` | row index | Stable React keys and sort identity. |
| `className` | `string` | — | Appended to the scroll container classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

## Typing

`Table` is generic in the row type and infers it from `data`, so cell renderers and
`onRowClick` are typed without annotation:

```tsx
<Table data={instances} columns={columns} onRowClick={(row) => row.vcpu} />
//                                                          ^ number
```

Type `columns` as `ColumnDef<T, V>[]` where `V` is the union of your accessor value types.
The library's own prop is `ColumnDef<T, any>[]` because `TValue` appears in both co- and
contravariant positions on `ColumnDef`, which makes a mixed-value column array
unrepresentable with `unknown`. That `any` never reaches your call site.

## Sorting

Every accessor column sorts by default; pressing a header cycles ascending, descending,
unsorted. Sortable headers are real buttons and the `<th>` carries `aria-sort`, so the
current direction is announced. A column without an accessor (an actions column, say) is
not sortable and gets no `aria-sort` at all. Opt a column out with `enableSorting: false`.

Sort state lives inside the component. If you need server-side sorting, use TanStack
directly — lifting the state out is not part of this API.

## Clickable rows

`onRowClick` turns each row into a genuine control: `role="button"`, `tabIndex={0}`, and
Enter/Space activation, so it is reachable and operable by keyboard and announced as
actionable. The explicit role is deliberate. It costs the row/cell semantics inside that
row, which is the right trade for a row whose whole job is to navigate; a focusable `<tr>`
that keeps its implicit `row` role announces nothing actionable at all.

Activation that originates from an `<a>`, `<button>`, `<input>`, `<select>`, or
`<textarea>` inside the row is ignored, so a per-row action button does not also trigger
the row. Nest controls freely.

## Layout

The header is sticky, so put the table in a height-constrained parent to get a scrolling
body under a fixed header. `pinFirstColumn` adds the `table-pinned` utility and drives its
`data-at-start` flag from the scroll position, which is what raises the drop shadow once
the first column starts overlapping content.

`loading` wins over `emptyState`: an empty array plus `loading` shows skeletons, not "no
results", so a first load never flashes an empty message.
