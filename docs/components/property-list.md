# PropertyList

A `<dl>` of label/value rows for detail panes and summary cards — the read-only counterpart
to a form. Labels are uppercase mono, values are sans, so the pair reads as metadata rather
than prose.

```tsx
import { PropertyList, PropertyItem } from '@cafekery/oxide-ui'

<PropertyList columns={2}>
  <PropertyItem label="Name">web-frontend</PropertyItem>
  <PropertyItem label="State">running</PropertyItem>
</PropertyList>
```

## PropertyList props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `columns` | `1 \| 2` | `1` | `2` collapses to a single column below the `sm` breakpoint. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<dl>` props.

## PropertyItem props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | The `<dt>`. Rendered uppercase by the mono type. |
| `children` | `ReactNode` | — | The `<dd>`. |
| `className` | `string` | — | Appended to the row wrapper classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus native `<div>` props.

## Notes

`PropertyItem` must be a direct child of `PropertyList` — each item is a grid item, and
nesting it inside another wrapper breaks the column layout. Each item renders a `<div>`
around its `<dt>`/`<dd>` pair, which is valid inside a `<dl>` and is what makes the grid
work.

Values wrap rather than overflow: long identifiers, URLs, and free text break onto more
lines instead of widening the pane. Values accept arbitrary nodes, so a `Badge`, a
`CopyButton`, or a coloured status span all drop in.
