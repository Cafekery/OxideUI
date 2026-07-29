# Sidebar

The fixed-width left rail. A `<nav>` landmark that scrolls independently, holding
`SidebarSection` groups and an optional `SidebarFooter` pinned to the bottom.

```tsx
import { NavItem, Sidebar, SidebarFooter, SidebarSection } from '@cafekery/oxide-ui'

<Sidebar>
  <SidebarSection>
    <NavItem to="/" active>Overview</NavItem>
  </SidebarSection>
  <SidebarSection title="Roasting">
    <NavItem to="/profiles">Profiles</NavItem>
  </SidebarSection>
  <SidebarFooter>
    <NavItem to="/docs">Documentation</NavItem>
  </SidebarFooter>
</Sidebar>
```

## Props

### Sidebar
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | `'Main'` | Names the landmark. Override when a page has more than one nav. |

Plus native `<nav>` props. Width comes from `--sidebar-width`.

### SidebarSection
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Optional group heading in uppercase mono. |

Plus native `<div>` props.

### SidebarFooter
Native `<div>` props only. `mt-auto` pushes it to the bottom of the rail.

## Router

Sidebars are made of `NavItem`s, so mount `OxideProvider` with your router's link
component near the root:

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- Every nav landmark on a page needs a distinct `aria-label`. `Breadcrumbs` already
  uses `Breadcrumb`, so the `Main` default does not clash.
- The rail sets its own width and border; put it directly inside `AppShell` rather
  than wrapping it in a sizing div.
