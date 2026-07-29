# AppShell

The standard dashboard frame: sidebar fixed on the left, top bar across the content
column, and a `<main>` that scrolls on its own. Pure layout — it holds no state.

```tsx
import { AppShell, NavItem, Sidebar, SidebarSection, TopBar } from '@cafekery/oxide-ui'

<AppShell
  sidebar={
    <Sidebar>
      <SidebarSection>
        <NavItem to="/" active>Overview</NavItem>
      </SidebarSection>
    </Sidebar>
  }
  topBar={<TopBar trailing={<Button size="sm">New batch</Button>}>Roasting</TopBar>}
>
  <PageHeader title="Overview" />
</AppShell>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `sidebar` | `ReactNode` | — | Required. Normally a `Sidebar`. |
| `topBar` | `ReactNode` | — | Sits above `<main>` in the content column. |
| `children` | `ReactNode` | — | Page content; scrolls independently. |

Plus native `<div>` props.

## Router

The shell itself does not navigate, but its sidebar does. Mount `OxideProvider` once
near the root with your router's link component:

```tsx
import { Link } from 'your-router'
import { AppShell, OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <AppShell sidebar={<AppSidebar />}>{children}</AppShell>
</OxideProvider>
```

## Notes

- A skip link is the first focusable element and jumps to `<main>`, which carries
  `tabIndex={-1}` so focus actually lands there instead of only scrolling. The id is
  generated per shell, so several shells on one page will not collide.
- The frame is `h-dvh` and clips its own overflow; only `<main>` scrolls. Do not wrap
  it in a scrolling container.
- No mobile drawer. On narrow viewports, hide the rail from the caller's side or
  render it inside a `Sheet`, which already handles focus trapping and Escape.
