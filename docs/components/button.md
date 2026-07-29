# Button

The standard text button. Five variants cover the emphasis levels this library needs;
reach for `IconButton` instead when the control has no label.

```tsx
import { Button } from '@cafekery/oxide-ui'

<Button variant="primary" onClick={save}>Save changes</Button>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'notice'` | `'primary'` | |
| `size` | `'sm' \| 'base'` | `'base'` | `sm` is 32px tall, `base` is 40px. |
| `loading` | `boolean` | `false` | Shows a `Spinner`, disables the button, sets `aria-busy`. |
| `type` | `'submit' \| 'reset' \| 'button'` | `'button'` | Defaulted, so it will **not** submit a surrounding form unless you pass `type="submit"`. |
| `disabled` | `boolean` | — | OR'd with `loading`; a loading button is always disabled. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<button>` props.

## Variants

- `primary` — accent fill. The one action the screen is for. Use at most one per view.
- `secondary` — neutral raised fill. Companion actions next to a primary.
- `ghost` — no fill until hover. Toolbar and table-row actions, anything repeated
  many times where a fill would turn into noise.
- `danger` — destructive fill. Deleting, terminating, detaching. Nothing recoverable.
- `notice` — notice fill. Confirming something that needs a beat of caution but is
  not destructive.

## The label is uppercase mono

Button text renders in `text-mono-sm`: 12px mono, letter-spaced, tabular numerals, and
`text-transform: uppercase`. `<Button>Save changes</Button>` reads SAVE CHANGES on screen.
Write labels in normal sentence case — the casing is presentational, and the DOM text
stays exactly as you passed it, so tests and screen readers see `Save changes`.

## Loading

```tsx
<Button loading={isSaving}>Save changes</Button>
```

While `loading` is true the button is disabled, carries `aria-busy`, and centres a
`Spinner` sized to match (`sm` → 12px, `base` → 16px). The label stays in the DOM,
rendered `invisible`, so the button keeps its exact width instead of collapsing to the
spinner and snapping back.

## Notes

- The disabled treatment keeps the variant's fill and dims only the label. Because
  `:hover` still matches a disabled button, every hover fill is written with the
  `enabled:` variant — otherwise a disabled button would light up under the cursor.
- Pressing nudges the button down 1px; the nudge is dropped under
  `prefers-reduced-motion`.
