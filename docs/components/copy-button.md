# CopyButton

An `IconButton` wired to the clipboard: copies `value`, flips its glyph to a check for a
beat, announces the result. Use it beside an ID, a hostname, a token — anything a reader
will want to paste somewhere else.

```tsx
import { CopyButton } from '@cafekery/oxide-ui'

<CopyButton value={instance.id} label="Copy instance ID" />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` | — | Required. The text written to the clipboard. |
| `label` | `string` | `'Copy'` | Accessible label in the resting state. |
| `copiedLabel` | `string` | `'Copied'` | Accessible label after a successful copy, and the text announced. |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'notice'` | `'ghost'` | |
| `size` | `'sm' \| 'base'` | `'sm'` | |

Plus native `<button>` props, and any other `IconButton` prop — `loading`, `disabled`,
`type`, `className`, `ref`. Note the defaults above differ from `IconButton`'s own
(`'primary'` / `'base'`): `CopyButton` passes `ghost`/`sm` before spreading your props, so
anything you set still wins.

`aria-label`, `children` and `onClick` are `Omit`ted from the props type and cannot be
passed. The component owns all three — the label comes from `label`/`copiedLabel`, the
child is the glyph, and the handler is the copy itself. Wrap it if you need to react to a
copy.

## Behaviour

Clicking writes `value` with `navigator.clipboard.writeText`. On success the glyph swaps
from `Copy` to an accent `Check` and the label becomes `copiedLabel` for 1.5s, then
reverts. Copying again mid-flash restarts the full 1.5s rather than inheriting the tail of
the previous one.

Failure is swallowed. A rejected permission, a denied user gesture, or a missing
`navigator.clipboard` — the case in any insecure context — produces no throw, no error
state, and no visual change: the button simply does not confirm. That is deliberate, so
the component is safe to render over plain HTTP without guarding it, but it does mean the
non-secure-context path is silent.

## Accessibility

The button is labelled by `label`, which becomes `copiedLabel` while the check shows, so
the accessible name reflects the current state. Confirmation is also announced through a
separate visually-hidden `aria-live="polite"` region, which is empty at rest — a user who
cannot see the glyph flip still hears "Copied".

Give `label` some context when several copy buttons sit on one page; five controls all
named "Copy" are useless in a list of links.
