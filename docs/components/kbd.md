# Kbd

A keycap. Renders a real `<kbd>` so shortcut hints in menus, tooltips, and empty states are
marked up as keyboard input rather than styled text.

```tsx
import { Kbd } from '@cafekery/oxide-ui'

<Kbd>⌘K</Kbd>
```

## Props

`KbdProps` is `ComponentPropsWithRef<'kbd'>` — there is nothing else. `children` is the key
text, and that is the entire API. `className` is appended, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged).

Plus native `<kbd>` props.

## Notes

The type is uppercase-transformed mono, so pass the real glyphs — `⌘K`, `⇧`, `⌥`, `↵`, `ESC`
— not lowercase words. `<Kbd>esc</Kbd>` renders as `ESC` anyway, but writing the glyph keeps
the source honest about what the user actually presses.

One cap per key. A chord is several caps side by side:

```tsx
<Kbd>⇧</Kbd> <Kbd>⌘</Kbd> <Kbd>P</Kbd>
```
