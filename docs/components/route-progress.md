# RouteProgress

The thin accent bar pinned to the top edge of the viewport while a navigation is
in flight. Drive it from the router's pending state.

```tsx
import { RouteProgress } from '@cafekery/oxide-ui'

<RouteProgress active={isNavigating} />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `active` | `boolean` | — | Required. Truthy while navigation is pending. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

## Behaviour

The bar grows quickly to roughly 45% and holds there for as long as `active` is
true, because the real duration is unknown. When `active` flips false it runs out
to full width and fades away.

Mount it once, near the root — it is `fixed` and stacks at `--z-toast`.

## Accessibility

The bar itself is `aria-hidden`, since a moving stripe means nothing to a screen
reader. State is announced instead through a visually hidden `aria-live="polite"`
region: "Loading page" while active, "Page loaded" once it completes. A component
that mounts already inactive announces nothing, so a cold page load stays silent.

Under `prefers-reduced-motion` the bar does not travel at all. It sits at full
width and pulses its opacity in place.
