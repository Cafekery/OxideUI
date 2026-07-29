# IconButton

A square `Button` for a single glyph — close, dismiss, copy, open a menu. Same variants
and sizes as `Button`, but `aria-label` is required rather than optional.

```tsx
import { Close, IconButton } from '@cafekery/oxide-ui'

<IconButton variant="ghost" size="sm" aria-label="Dismiss" onClick={dismiss}>
  <Close />
</IconButton>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `aria-label` | `string` | — | **Required.** Typed as required, not optional. |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'notice'` | `'primary'` | |
| `size` | `'sm' \| 'base'` | `'base'` | Square: `sm` is 32x32, `base` is 40x40. |
| `loading` | `boolean` | `false` | Replaces the glyph with a `Spinner`, disables the button, sets `aria-busy`. |
| `type` | `'submit' \| 'reset' \| 'button'` | `'button'` | Defaulted, so it will not submit a surrounding form unless you pass `type="submit"`. |
| `disabled` | `boolean` | — | OR'd with `loading`. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<button>` props.

## Sizing the glyph

The box is fixed by `size`, the glyph is not. Icons render at `1em`, so font size drives
glyph size and you adjust it with a type utility on the button:

```tsx
<IconButton aria-label="Search" className="text-sans-16">
  <Search />
</IconButton>
```

Unless you do that, the glyph inherits the button's 12px mono font size.

## Accessibility

`aria-label` is a required prop because the button has no text content — TypeScript will
reject the call if you omit it. There is no fallback label; an unlabelled icon button is a
button a screen reader reads as "button" and nothing else, so the type makes the mistake
impossible rather than merely discouraged.

Label the action, not the picture: "Dismiss", not "X". Child glyphs are `aria-hidden` by
default, so they never compete with the label.

Unlike `Button`, the loading spinner replaces the glyph outright — the box is already
square and fixed, so there is no width to preserve.
