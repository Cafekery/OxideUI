# Tooltip

A short hover/focus label on the inverse surface, for naming an icon-only control or
expanding a truncated value. Built on Radix Tooltip, so it opens on keyboard focus as well
as hover and closes on Escape.

Mount `TooltipProvider` **once**, high in the app. It owns the shared open/close timing that
makes moving between neighbouring tooltips feel instant instead of re-triggering the delay
on each one. Without it, Radix throws.

```tsx
import { IconButton, Tooltip, TooltipProvider } from '@cafekery/oxide-ui'

<TooltipProvider>
  <App />
</TooltipProvider>

<Tooltip content="Copy to clipboard">
  <IconButton aria-label="Copy"><Copy /></IconButton>
</Tooltip>
```

Never put interactive content in a tooltip — the panel is `pointer-events: none` and a
keyboard user cannot reach it. Anything clickable belongs in a `Popover`.

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | Required. The bubble text. |
| `children` | `ReactNode` | — | Required. The trigger, rendered via `asChild`. |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side; flips on collision. |
| `sideOffset` | `number` | `5` | Gap from the trigger, in px. |
| `delayDuration` | `number` | `200` | Hover delay before opening, in ms. |
| `open` / `defaultOpen` / `onOpenChange` | — | — | Optional, for driving it yourself. |
| `className` | `string` | — | Appended to the bubble classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus every Radix `Tooltip.Content` prop and native `<div>` props.

A tooltip's trigger must have its own accessible name — the tooltip is described-by, not
labelled-by. Keep the `aria-label` on your `IconButton`.
