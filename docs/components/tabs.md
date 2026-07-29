# Tabs

Underlined tabs over a shared panel area, built on Radix Tabs. Takes the whole set as
`items`, so the list and the panels stay in sync.

```tsx
import { Tabs } from '@cafekery/oxide-ui'

<Tabs
  aria-label="Roast profile"
  items={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'batches', label: 'Batches', content: <Batches /> },
  ]}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | — | Required. One entry per tab. |
| `value` | `string` | — | Controlled selection. |
| `defaultValue` | `string` | first item | Uncontrolled starting tab. |
| `onValueChange` | `(value: string) => void` | — | Fires on every selection change. |
| `aria-label` | `string` | — | Applied to the tab list, which is what assistive tech reads. |

`TabItem` is `{ value: string; label: ReactNode; content: ReactNode }`.

Plus the native `<div>` props Radix's `Tabs.Root` accepts, except `children`.

## Router

`Tabs` does not navigate — it swaps panels in place. For tabs that change the URL,
use `NavItem`s and mount `OxideProvider` with your router's link component:

```tsx
import { Link } from 'your-router'
import { OxideProvider } from '@cafekery/oxide-ui'

<OxideProvider link={({ to, ...rest }) => <Link href={to} {...rest} />}>
  <App />
</OxideProvider>
```

## Notes

- Arrow-key roving focus, `role="tab"` wiring and panel association come from Radix.
- Put `aria-label` on the component, not on a wrapper; it is forwarded to the tab
  list where it actually names the control.
- Only the selected panel is mounted; switching tabs unmounts the previous one and
  discards its local state. Lift anything that has to survive the switch.
