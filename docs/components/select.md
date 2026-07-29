# Select

One choice from a list too long to show inline. Takes plain option objects — you never assemble item
children by hand.

```tsx
import { Select } from '@cafekery/oxide-ui'

<Select
  label="Region"
  placeholder="Pick a region"
  options={[
    { value: 'us-west', label: 'US West (Oregon)' },
    { value: 'eu-central', label: 'EU Central (Frankfurt)' },
    { value: 'ap-south', label: 'AP South — no capacity', disabled: true },
  ]}
  onValueChange={setRegion}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | |
| `options` | `SelectOption[]` | — | `{ value, label, disabled? }`. |
| `placeholder` | `string` | — | Shown until a value is set; styled `text-quaternary`. |
| `description` | `ReactNode` | — | |
| `error` | `ReactNode` | — | Sets `aria-invalid` and reddens the trigger border. |
| `value` / `defaultValue` | `string` | — | Controlled / uncontrolled selection. |
| `onValueChange` | `(value: string) => void` | — | |
| `disabled` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Adds the `*` marker. |
| `name` | `string` | — | For native form submission. |
| `ref` | `Ref<HTMLButtonElement>` | — | Points at the trigger. |

`className` is merged onto the trigger, which matches `TextField`'s metrics. The menu is portalled,
positioned with `popper`, capped at `max-h-60`, and layered at `--z-popover`.
