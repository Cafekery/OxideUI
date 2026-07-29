# NumberField

`TextField` specialised for a bounded number, with `−`/`+` steppers either side of the value. Reports
`role="spinbutton"` with its current value and bounds.

```tsx
import { NumberField } from '@cafekery/oxide-ui'

<NumberField label="Instances" defaultValue={3} min={1} max={5} />

const [count, setCount] = useState(2)
<NumberField label="Instances" value={count} onValueChange={setCount} min={0} max={8} />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Also names the steppers ("Increase Instances"). |
| `value` | `number` | — | Controlled value. |
| `defaultValue` | `number` | `min ?? 0` | Uncontrolled initial value. |
| `onValueChange` | `(value: number) => void` | — | Always receives a clamped value. |
| `min` / `max` | `number` | — | Clamps typing and stepping; exposed as `aria-valuemin` / `aria-valuemax`. |
| `step` | `number` | `1` | Stepping rounds to the step's own precision, so `0.1` steps stay exact. |
| `description` | `ReactNode` | — | |
| `error` | `ReactNode` | — | |

Plus native `<input>` props except `value`, `defaultValue`, `onChange`, `min`, `max`, `step`, `type`,
`leading` and `trailing`, which this component owns.

Behaviour worth knowing:

- ArrowUp / ArrowDown step by `step`; the stepper for a bound you are already on is disabled.
- Typing keeps in-progress text such as `0.` or `-` intact, but a value that clamping corrected — or
  that a controlled parent refused — is replaced by the resolved number immediately.
- Blur always snaps the display back to the resolved value, so partial input never lingers.
