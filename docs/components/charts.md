# Charts

Themed wrappers over `recharts` so charts inherit the design tokens instead of every app
restyling them. Four shapes: `AreaChart` for a single trend, `LineChart` for compared
series, `BarChart` for discrete categories, `Sparkline` for an inline trend cell.

```tsx
import { AreaChart } from '@cafekery/oxide-ui'

const hour = new Intl.DateTimeFormat('en-US', { hour: 'numeric' })

<AreaChart
  aria-label="Requests per hour"
  data={traffic}
  xKey="at"
  yKey="requests"
  formatX={(value) => hour.format(Number(value))}
/>
```

## The token bridge

Charts paint SVG attributes, and SVG attributes cannot reference a CSS variable. So
`useChartTheme` reads the resolved values off `document.documentElement` at runtime —
grid lines from `--stroke-tertiary`, axis text from `--content-tertiary`, the hover cursor
from `--surface-hover`, and the series palette from `--content-accent`, `--content-info`,
`--content-accent-alt`, `--content-notice`, `--content-error`.

A `MutationObserver` watches `data-theme` on the same element, so flipping the theme
restyles every mounted chart in place with no remount. On the server there is nothing to
read and every colour falls back to `currentColor`, which inherits the container's text
colour rather than painting black on black.

Nothing else needs to know about this. Reach for the hook only when you are composing raw
recharts children yourself, or when you want a chart colour somewhere outside a chart.

```tsx
const theme = useChartTheme()
```

## Series colours

`LineChart` and `BarChart` take a `series` array and walk the palette in order. Set `color`
on an entry to override it — any CSS colour string works, but prefer a token so the value
still follows the theme:

```tsx
const theme = useChartTheme()

<LineChart
  aria-label="Latency percentiles"
  data={latency}
  xKey="at"
  series={[
    { key: 'p50', label: 'p50' },
    { key: 'p99', label: 'p99', color: theme.series[4] },
  ]}
/>
```

## Formatting

There is no formatting dependency. `formatX` and `formatY` take a `(value) => string`
function; build it from `Intl.NumberFormat` or `Intl.DateTimeFormat` and hoist the
formatter out of render so it is constructed once. Store dates as epoch milliseconds or
ISO strings in the data — not `Date` objects — and format them on the way out.

## Accessibility

The container is `role="img"` and `aria-label` is required; everything recharts draws is
`aria-hidden` and not focusable. Write a label that says what the chart shows, not that it
is a chart.

## AreaChart

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | Required. |
| `data` | `readonly ChartDatum[]` | — | |
| `xKey` | `string` | — | Field for the category axis. |
| `yKey` | `string` | — | Field for the value axis. |
| `height` | `number` | `220` | Pixels. Width fills the parent. |
| `variant` | `'smooth' \| 'step'` | `'smooth'` | |
| `formatX` | `TickFormatter` | — | Also formats the tooltip label. |
| `formatY` | `TickFormatter` | — | Also formats tooltip values. |

## LineChart

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | Required. |
| `data` | `readonly ChartDatum[]` | — | |
| `xKey` | `string` | — | |
| `series` | `readonly ChartSeries[]` | — | `{ key, label, color? }`. |
| `height` | `number` | `220` | |
| `formatX` | `TickFormatter` | — | |
| `formatY` | `TickFormatter` | — | |

## BarChart

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | Required. |
| `data` | `readonly ChartDatum[]` | — | |
| `xKey` | `string` | — | |
| `series` | `readonly ChartSeries[]` | — | |
| `height` | `number` | `220` | |
| `stacked` | `boolean` | `false` | Only the top segment is rounded. |
| `formatX` | `TickFormatter` | — | |
| `formatY` | `TickFormatter` | — | |

## Sparkline

Axis-less and tooltip-less, sized by the caller. Give it a width.

```tsx
<Sparkline aria-label="Error rate trend for api-gateway" className="w-24" data={trend} yKey="value" />
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | Required. |
| `data` | `readonly ChartDatum[]` | — | |
| `yKey` | `string` | — | |
| `height` | `number` | `24` | |
| `color` | `string` | palette head | |

All four also take native `<div>` props, including `className` and `ref`.

## Types

| Type | Shape |
| --- | --- |
| `ChartDatum` | `Record<string, string \| number \| null>` |
| `ChartSeries` | `{ key: string; label: string; color?: string }` |
| `TickFormatter` | `(value: string \| number) => string` |
| `ChartTheme` | `{ grid, axis, cursor, series }` — resolved colour strings |
