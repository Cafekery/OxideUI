# FilterBar

A horizontal strip of removable chips showing which filters are currently applied, with an
optional clear-all. Purely presentational — it holds no filter state and does no filtering.

```tsx
import { FilterBar } from '@cafekery/oxide-ui'

<FilterBar
  filters={[{ id: 'state', label: 'State', value: 'running' }]}
  onRemove={(id) => setFilters((current) => current.filter((f) => f.id !== id))}
  onClearAll={() => setFilters([])}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `filters` | `FilterChip[]` | — | `{ id, label, value }`. Renders nothing when empty. |
| `onRemove` | `(id: string) => void` | — | Called with the chip's `id`. |
| `onClearAll` | `() => void` | — | Clear-all only renders when supplied. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<div>` props.

## Notes

Each chip is a button whose accessible name says what pressing it does, naming the filter
being dropped rather than a bare "remove": `Remove filter State: running`. The chip text
shows the label dimmed beside the value, and the label is spoken only through that
accessible name, so screen reader users get the full sentence instead of two loose
fragments.

The chips are a labelled list, so the set is announced with its item count — "Active
filters, list, 3 items" — which tells you how many filters are on before you walk them.

An empty `filters` array renders `null` rather than an empty strip, so the surrounding
layout collapses instead of leaving a gap. If you need the bar to hold its space, reserve
it in the parent.
