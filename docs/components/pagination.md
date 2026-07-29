# Pagination

Page controls for a table or list: previous/next arrows around a compact window of page
numbers, with an optional rows-per-page select. Fully controlled — it holds no state.

```tsx
import { Pagination } from '@cafekery/oxide-ui'

<Pagination page={page} pageCount={12} onPageChange={setPage} />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | `number` | — | Current page, 1-based. Clamped into range before rendering. |
| `pageCount` | `number` | — | Total pages. Renders nothing below `1`. |
| `onPageChange` | `(page: number) => void` | — | Called with the requested page. |
| `pageSize` | `number` | — | Shows the rows-per-page select when paired with `onPageSizeChange`. |
| `onPageSizeChange` | `(pageSize: number) => void` | — | Required for the select to appear. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<nav>` props.

## The page window

Up to seven pages render as plain numbers. Beyond that the window collapses to first page,
current ± 1, and last page, joined by ellipses — always exactly seven slots, so the control
never changes width as you page through. An ellipsis always stands in for at least two
pages; it is never used to hide a single one.

```
page 1  of 10   1 2 3 4 5 … 10
page 5  of 10   1 … 4 5 6 … 10
page 10 of 10   1 … 6 7 8 9 10
```

The current page is marked `aria-current="page"`, and the arrows are disabled at each end.

## Rows per page

Pass both `pageSize` and `onPageSizeChange` to get the select. Options are 10/25/50/100,
plus the current `pageSize` if it is not one of those, so an unusual value still shows as
selected rather than blank. Reset `page` to 1 yourself when the size changes — the
component does not assume that for you.
