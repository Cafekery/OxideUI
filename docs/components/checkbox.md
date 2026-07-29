# Checkbox

A single boolean, labelled inline. Supports a third `indeterminate` state for "some of the children
are selected" headers.

```tsx
import { Checkbox } from '@cafekery/oxide-ui'

<Checkbox label="Email me when the run finishes" defaultChecked />

<Checkbox label="Select all instances" checked="indeterminate" onCheckedChange={selectAll} />

<Checkbox label="Accept the terms" required error="You must accept the terms to continue." />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Rendered beside the box and wired with `htmlFor`. |
| `description` | `ReactNode` | — | Indented under the label. |
| `error` | `ReactNode` | — | Sets `aria-invalid` and reddens the unchecked border. |
| `checked` | `boolean \| 'indeterminate'` | — | Controlled state. |
| `defaultChecked` | `boolean \| 'indeterminate'` | `false` | Uncontrolled initial state. |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | — | Fires with `true` when an indeterminate box is clicked. |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Adds the `*` marker. |

Plus the rest of Radix Checkbox's root props (`name`, `value`, `form`) and `ref`. `className` is
merged onto the box.

Checked renders the `Check` glyph, indeterminate renders `Minus`, and the control reports
`aria-checked="mixed"` in that state.
