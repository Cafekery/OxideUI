# Switch

An immediate on/off setting. Use it when flipping it takes effect straight away; use `Checkbox` when
the value is submitted with a form.

```tsx
import { Switch } from '@cafekery/oxide-ui'

<Switch label="Automatic snapshots" description="Taken every night at 02:00 UTC." defaultChecked />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Rendered beside the track and wired with `htmlFor`. |
| `description` | `ReactNode` | — | Indented under the label. |
| `error` | `ReactNode` | — | Sets `aria-invalid` and rings the track in `ring-error`. |
| `checked` / `defaultChecked` | `boolean` | — | Controlled / uncontrolled state. |
| `onCheckedChange` | `(checked: boolean) => void` | — | |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Adds the `*` marker. |

Plus the rest of Radix Switch's root props (`name`, `value`, `form`) and `ref`. `className` is merged
onto the track. The control reports `role="switch"` with `aria-checked`.
