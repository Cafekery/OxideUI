# TextField

A single-line text input with its label, description and error wiring already done. Reach for it for
every free-text value; use `NumberField` for numbers and `Select` for a fixed set of options.

```tsx
import { TextField } from '@cafekery/oxide-ui'
import { Search } from '@cafekery/oxide-ui'

<TextField label="Search" placeholder="Find an instance" leading={<Search />} />

<TextField
  label="Slug"
  required
  description="Lowercase letters and dashes only."
  error="That slug is already taken."
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | |
| `description` | `ReactNode` | — | |
| `error` | `ReactNode` | — | Presence switches the border to `border-error` and sets `aria-invalid`. |
| `leading` | `ReactNode` | — | Icon or short text in a 36px zone; the input is padded to match. |
| `trailing` | `ReactNode` | — | Same on the right. Interactive content works — it is not click-blocked. |

Plus native `<input>` props, including `ref`. `className` is appended to the `<input>`'s classes;
because Tailwind resolves conflicts by generated CSS order rather than class order, add `!` when you
need to beat a base utility (`className="h-8!"`). Size the field by sizing its container — the input
is `w-full`.

The generated `id` and `aria-*` attributes are applied after your props, so they cannot be
accidentally overwritten.
