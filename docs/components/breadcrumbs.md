# Breadcrumbs

The trail back up the hierarchy. The last crumb is the current page and is never a
link; longer trails collapse in the middle.

```tsx
import { Breadcrumbs } from '@cafekery/oxide-ui'

<Breadcrumbs
  items={[
    { label: 'Cafekery', to: '/' },
    { label: 'Roasting', to: '/roasting' },
    { label: 'batch-104' },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | — | Required. Root first, current page last. |

`BreadcrumbItem` is `{ label: string; to?: string }`. A crumb without `to` renders as
plain text.

Plus native `<nav>` props. `aria-label` defaults to `Breadcrumb` and can be overridden.

## Router

Crumbs with a `to` render through the link component from `OxideProvider`:

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- Past four items the middle collapses to `…`, leaving the root and the last two
  crumbs. Pass the full trail; the component decides what to hide.
- The last crumb gets `aria-current="page"` even if you supply a `to` for it.
- Separators and the ellipsis are `aria-hidden`, so screen readers hear the trail as
  a clean list.
