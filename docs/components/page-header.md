# PageHeader

The title block at the top of a page: breadcrumbs, an `<h1>`, a description and
right-aligned actions that wrap on narrow widths.

```tsx
import { Button, PageHeader } from '@cafekery/oxide-ui'

<PageHeader
  title="Ethiopia natural"
  description="Every roast recorded against this profile, newest first."
  breadcrumbs={[{ label: 'Roasting', to: '/roasting' }, { label: 'Ethiopia natural' }]}
  actions={<Button size="sm">New batch</Button>}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. Rendered as the page `<h1>`. |
| `description` | `ReactNode` | — | One line of context under the title. |
| `actions` | `ReactNode` | — | Right-aligned; wraps below the title when space runs out. |
| `breadcrumbs` | `BreadcrumbItem[]` | — | Rendered above the title via `Breadcrumbs`. |

Plus native `<header>` props, except `title` and `children`.

## Router

Only the breadcrumbs navigate. Mount `OxideProvider` with your router's link
component near the root so they use it:

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- The title is an `<h1>`, so use one `PageHeader` per page.
- It takes no `children`. Anything below the header — tabs, filters, a table — is a
  sibling, which keeps the heading and the content in separate blocks.
