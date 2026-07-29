# LoadingOverlay

Covers the nearest positioned ancestor with a scrim and a centred `Spinner`,
for refreshing content that is already on screen.

```tsx
import { LoadingOverlay } from '@cafekery/oxide-ui'

<div className="relative">
  <InstanceTable rows={rows} />
  <LoadingOverlay active={isRefetching} label="Refreshing instances" />
</div>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `active` | `boolean` | — | Required. Renders nothing when false. |
| `label` | `string` | `'Loading'` | The Spinner's accessible label. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

## Notes

- The parent **must** be positioned (`relative`); the overlay is `absolute inset-0`.
- While active it blocks pointer events over the content it covers. That is the point:
  do not use it for background polling the user should be able to work through.
- Under `prefers-reduced-motion` the scrim appears instantly instead of fading.

## Accessibility

Inactive, it renders no DOM at all, so it cannot trap focus or add noise for a
screen reader.

Active, it sets `aria-busy="true"` on its parent — the element whose content is
actually obscured. Any value the parent was already managing is restored exactly
when the overlay goes away, so a container that drives its own `aria-busy` is
safe to wrap.
