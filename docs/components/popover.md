# Popover

A small floating panel anchored to a trigger, for secondary detail or a compact form that
does not deserve a modal. Unlike `Tooltip` it may hold interactive content, and unlike
`Menu` it imposes no list semantics. Built on Radix Popover: Escape and outside clicks
dismiss it, focus moves into it on open and back to the trigger on close.

```tsx
import { Button, Popover } from '@cafekery/oxide-ui'

<Popover trigger={<Button variant="secondary">Why paused?</Button>}>
  Two of four replicas failed their health check.
</Popover>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Required. Rendered via `asChild`, so pass one element that forwards props and a ref. |
| `children` | `ReactNode` | — | The panel content. |
| `open` / `defaultOpen` | `boolean` | — | Optional. Uncontrolled by default. |
| `onOpenChange` | `(open: boolean) => void` | — | |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side; flips on collision. |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | |
| `sideOffset` | `number` | `6` | Gap from the trigger, in px. |
| `arrow` | `boolean` | `false` | Draws a small pointer at the anchor edge. |
| `className` | `string` | — | Appended to the panel classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus every Radix `Popover.Content` prop and native `<div>` props.

## Layering

The panel sits at `--z-popover`, which is below `Modal` and `Sheet`. A popover opened from
inside one of those needs to be raised explicitly, and because both classes set the same
property you need the important modifier for it to win:

```tsx
<Popover className="z-[var(--z-modal-dropdown)]!" trigger={…}>
```
