# ProgressBar / MeterBar

Two horizontal bars with the same props shape and different meanings. `ProgressBar` is for a
task that finishes; `MeterBar` is for a quota or capacity gauge that reads as consumption.

```tsx
import { ProgressBar, MeterBar } from '@cafekery/oxide-ui'

<ProgressBar value={42} label="Uploading" />
<MeterBar value={93} label="Storage used" />
```

## Value

`value` is a percentage, not a fraction, and is clamped into `0`–`100`. A non-finite value
(`NaN`, `Infinity`) reads as `0`. The fill width animates, except under reduced motion.

Neither component takes children — the bar is the whole element.

## Which one

`ProgressBar` keeps one colour at every value: it says "how far along", and going up is
neither good nor bad.

`MeterBar` escalates with the reading:

| Value | Fill |
| --- | --- |
| below `75` | accent |
| `75` through `90` inclusive | notice |
| above `90` | error |

The boundaries are exact: `75` and `90` are both notice, `90.5` is error.

## Accessibility

`role` (`progressbar` / `meter`) and the `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
triplet are the components' contract. They are `Omit`ted from the props type and applied
after your spread, so they cannot be overridden.

`label` supplies the accessible name. If the bar is already labelled by visible text on the
page, skip `label` and pass `aria-labelledby` instead.

```tsx
<span id="quota-label">Storage used</span>
<MeterBar value={93} aria-labelledby="quota-label" />
```

## Props

Identical for both components.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `number` | — | Required. Percentage, clamped to `0`–`100` |
| `size` | `'sm' \| 'base'` | `'base'` | Track height `4px` / `8px` |
| `label` | `string` | — | Accessible name |

Plus native `<div>` props, except `children`, `role`, and the `aria-value*` triplet.
