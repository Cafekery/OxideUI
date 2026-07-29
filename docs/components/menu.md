# Menu

A dropdown of actions hung off a trigger — row overflow menus, bulk actions, column
pickers. Built on Radix DropdownMenu, so arrow-key roving focus, typeahead, Escape,
outside-click dismissal and the `menu`/`menuitem` roles come for free.

```tsx
import { Button, Menu, MenuItem, MenuSeparator } from '@cafekery/oxide-ui'

<Menu trigger={<Button variant="secondary">Actions</Button>}>
  <MenuItem icon={<Copy />} shortcut="⌘C" onSelect={copyId}>Copy ID</MenuItem>
  <MenuItem disabled>Transfer ownership</MenuItem>
  <MenuSeparator />
  <MenuItem destructive onSelect={remove}>Delete instance</MenuItem>
</Menu>
```

## Menu
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Required. Rendered via `asChild`, so pass one element that forwards props and a ref. |
| `open` / `defaultOpen` | `boolean` | — | Optional. Uncontrolled by default. |
| `onOpenChange` | `(open: boolean) => void` | — | |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | |
| `sideOffset` | `number` | `6` | Gap from the trigger, in px. |
| `className` | `string` | — | Appended to the panel classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus every Radix `DropdownMenu.Content` prop and native `<div>` props.

## MenuItem
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `onSelect` | `(event: Event) => void` | — | Fires on click and on Enter/Space. Call `event.preventDefault()` to keep the menu open. |
| `icon` | `ReactNode` | — | Leading glyph. Inherits the row's colour. |
| `shortcut` | `ReactNode` | — | Trailing `Kbd` hint. The keycap renders uppercase, so `"del"` and `"DEL"` look identical — write whichever reads better. Modifier glyphs (`⌘`, `⇧`) pass through as-is. |
| `destructive` | `boolean` | `false` | Error-coloured label for the one row that removes something. |
| `disabled` | `boolean` | `false` | Dims the row and takes it out of the roving focus order. |

`MenuCheckboxItem` takes `checked` / `onCheckedChange` instead, plus `shortcut`, and draws a
check in a reserved leading slot. Multi-select menus usually want
`onSelect={(e) => e.preventDefault()}` so toggling one column does not dismiss the panel.

`MenuLabel` is a non-interactive uppercase-mono group heading. `MenuSeparator` is a hairline
between groups — it already carries the separator role, so do not wrap it in `Divider`.

## Layering

The panel sits at `--z-popover`, below `Modal` and `Sheet`. Raise a menu opened from inside
one of those with `className="z-[var(--z-modal-dropdown)]!"` — the important modifier is
needed because both classes set the same property.
