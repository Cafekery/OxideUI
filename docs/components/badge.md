# Badge

A small inline chip for status, counts, and short labels. Reach for it inside table cells,
list rows, and headers — anywhere a word of metadata needs to read as a distinct token
rather than as prose.

```tsx
import { Badge } from '@cafekery/oxide-ui'

<Badge variant="notice">Pending</Badge>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'accent' \| 'success' \| 'notice' \| 'error' \| 'info' \| 'neutral'` | `'default'` | Fill and label colour. |
| `size` | `'sm' \| 'base'` | `'base'` | `sm` is 16px tall, `base` is 20px. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<span>` props.

## Variants

`accent`, `success`, `notice`, `error`, and `info` are the semantic hues — pick by meaning,
not by colour. `success` is the one hue pinned to the raw green scale rather than a
semantic surface, because `accent` is swappable per deployment and would otherwise drag
"success" along with it.

`default` and `neutral` both draw from the neutral ramp, so neither is redundant — they
differ in weight, on both the fill and the label:

- `default` is the everyday chip: the secondary surface with full-contrast label text, so
  it holds its own as the only badge in a row.
- `neutral` is the quieter, recessed one: the tertiary surface with dimmed label text. Use
  it for a badge sitting beside a coloured one that should carry the attention, or for
  counts and tags that are reference detail rather than status.

## Notes

The label is set in uppercase mono, so children are rendered uppercase regardless of how
you write them — `<Badge>pending</Badge>` and `<Badge>Pending</Badge>` look identical. Write
them however reads best in source; don't shout in the JSX. The type is also tabular, so
numeric badges of the same digit count stay the same width.
