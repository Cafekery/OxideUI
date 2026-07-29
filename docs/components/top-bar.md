# TopBar

The sticky bar across the top of the content column. Three slots — `leading`,
`children`, `trailing` — laid out on one compact row.

```tsx
import { Filter, TopBar } from '@cafekery/oxide-ui'

<TopBar leading={<Logo />} trailing={<Button size="sm">New batch</Button>}>
  <span>Roasting</span>
</TopBar>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `leading` | `ReactNode` | — | Left slot. Omitted entirely when not given. |
| `children` | `ReactNode` | — | Centre slot; takes the remaining width. |
| `trailing` | `ReactNode` | — | Right slot, usually actions. |

Plus native `<header>` props. Height comes from `--top-bar-height`.

## Router

`TopBar` does not navigate on its own. If you drop `NavItem`s or `Breadcrumbs` into a
slot, mount `OxideProvider` with your router's link component near the root:

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- It sticks at `--z-top-bar`. Dropdowns opened from it should sit at
  `--z-top-bar-dropdown` so they clear the bar.
- Rendered as `<header>`. Inside `AppShell` that makes it the page's banner landmark,
  so do not add a second one.
