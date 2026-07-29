# EmptyState

The centred "nothing here yet" block for an empty table, panel or page. It draws no
background of its own, so it inherits whichever surface it is dropped into.

```tsx
import { Button, EmptyState, Filter } from '@cafekery/oxide-ui'

<EmptyState
  title="No matching instances"
  description="No instance matches the current filter."
  icon={<Filter />}
  action={<Button size="sm" variant="secondary">Clear filter</Button>}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | — | Required. The short headline. |
| `description` | `string` | — | Capped at `max-w-prose` so long copy stays readable. |
| `icon` | `ReactNode` | — | Rendered muted and `aria-hidden`; decorative only. |
| `action` | `ReactNode` | — | Usually a single `Button`. |

Plus native `<div>` props.

## Notes

- No background is applied. Wrap it in the container that owns the surface.
- Because `icon` is hidden from assistive tech, never put meaning there that is
  not already in `title` or `description`.
