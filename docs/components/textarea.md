# Textarea

A multi-line text input sharing `TextField`'s visual language. Vertically resizable, with a thin
themed scrollbar.

```tsx
import { Textarea } from '@cafekery/oxide-ui'

<Textarea label="Description" placeholder="What is this project for?" rows={6} />
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | |
| `description` | `ReactNode` | — | |
| `error` | `ReactNode` | — | Switches the border to `border-error` and sets `aria-invalid`. |
| `rows` | `number` | `4` | |

Plus native `<textarea>` props, including `ref`. `className` is appended to the `<textarea>`'s
classes; add `!` to beat a base utility (`className="min-h-40!"`).
