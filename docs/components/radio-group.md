# RadioGroup

One choice from a small, visible set. The group carries the label; each `RadioGroupItem` carries its
own. Arrow keys move between options and Space selects the focused one.

```tsx
import { RadioGroup, RadioGroupItem } from '@cafekery/oxide-ui'

<RadioGroup label="Deployment size" defaultValue="small" required>
  <RadioGroupItem value="small" label="Small — 2 vCPU, 8 GiB" />
  <RadioGroupItem value="medium" label="Medium — 4 vCPU, 16 GiB" />
  <RadioGroupItem value="large" label="Large — out of capacity" disabled />
</RadioGroup>
```

## RadioGroup props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Names the group via `aria-labelledby`; `htmlFor` cannot name a `radiogroup`. |
| `description` | `ReactNode` | — | |
| `error` | `ReactNode` | — | Sets `aria-invalid` on the group. |
| `value` / `defaultValue` | `string` | — | Controlled / uncontrolled selection. |
| `onValueChange` | `(value: string) => void` | — | |
| `disabled` | `boolean` | `false` | Disables every option. |
| `required` | `boolean` | `false` | Adds the `*` marker. |

Plus native `<div>` props and `ref`. `className` is merged onto the group, which is a `flex-col` by
default — pass `className="flex-row gap-4"` for a horizontal set.

## RadioGroupItem props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Rendered beside the circle. |
| `value` | `string` | — | Required. |
| `disabled` | `boolean` | `false` | Skipped by arrow navigation. |

Plus native `<button>` props and `ref`. `className` is merged onto the circle.
