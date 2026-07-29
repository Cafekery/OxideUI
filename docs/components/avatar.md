# Avatar

A circular person marker: a photo when you have one, deterministic tinted initials when you
don't. Use it in list rows, tables, comment threads, and assignee pickers.

```tsx
import { Avatar } from '@cafekery/oxide-ui'

<Avatar name="Jane Watson" />
<Avatar name="Jane Watson" src="/people/jane.jpg" size="lg" />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `string` | — | Required. Drives both the initials and the accessible name. |
| `src` | `string` | — | Photo URL. Falls back to initials if it fails to load. |
| `size` | `'xs' \| 'sm' \| 'base' \| 'lg'` | `'base'` | 20px, 24px, 32px, 40px. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<span>` props, except `children` — the content is derived from `name` and
`src`, so it is not yours to set.

## Initials

Taken from the first and last words of `name`: first word's initial, then the last word's
initial, uppercased.

| `name` | Initials |
| --- | --- |
| `'Jane Watson'` | `JW` |
| `'Jane Mary Watson'` | `JW` |
| `'Jane'` | `J` |
| `'  jane   watson  '` | `JW` |

Middle names are skipped, not truncated — three words still give you the outer two. A
single word gives a single letter. Runs of whitespace collapse, and leading and trailing
whitespace is trimmed, so unsanitised names from a database are fine.

## Tint

The fill is picked by hashing `name` into one of five tints, so a given person is always the
same colour everywhere in the app without you storing anything. Each tint is defined for
both themes and swaps automatically under `[data-theme='light']`.

`avatarInitials` and `avatarTint` are exported so you can match an avatar's colour
elsewhere — a coloured label in a list, a legend, a mention chip:

```tsx
import { avatarInitials, avatarTint } from '@cafekery/oxide-ui'

<span className={avatarTint(user.name)}>{avatarInitials(user.name)}</span>
```

`avatarTint(name)` returns the class string for that person's tint; `avatarInitials(name)`
returns the same string the component would render. Both are pure functions of `name`.

## Images

With `src` set, the component renders an `<img>` with `alt={name}` filling the circle and
cropped to cover. If it errors, the component remembers that one URL and shows initials
instead. Only that URL is written off: pass a different `src` and it is attempted, while the
same failed URL stays on initials. So a retry means re-rendering with a different URL, not
resetting anything.

## Accessibility

In the initials state the wrapper owns `role="img"` with `aria-label={name}`, so the avatar
announces as the person rather than as two stray letters. In the image state the `<img alt>`
carries the name instead and the wrapper stays silent. Native props are spread after these,
so an explicit `role` or `aria-label` will override them — only do that if you are supplying
an equivalent accessible name yourself.
