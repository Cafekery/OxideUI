# NavItem

A single row in a sidebar or nav list. Renders the link component supplied by
`OxideProvider`, so it never imports a router itself.

```tsx
import { Calendar, NavItem } from '@cafekery/oxide-ui'

<NavItem to="/batches" icon={<Calendar />} badge={<span>4</span>} active>
  Batches
</NavItem>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `to` | `string` | — | Required. Passed straight to the host link. |
| `children` | `ReactNode` | — | Required. The label; truncates rather than wrapping. |
| `icon` | `ReactNode` | — | Sizes to `1em`, so it tracks the label. |
| `badge` | `ReactNode` | — | Pinned to the trailing edge. |
| `active` | `boolean` | `false` | Applies the accent fill and `aria-current="page"`. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Not a native element — it renders whatever link the provider supplies, so only the
props above are accepted.

## Router

Mount `OxideProvider` once, near the root, with your router's link component. Without
it, `NavItem` falls back to a plain `<a href>`.

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- `active` is yours to compute from the current route; the component never reads
  location itself.
- Set `active` on exactly one item per nav region — `aria-current="page"` is meant to
  be unique.
