# Field

The wrapper every stacked form control composes: it renders the label, optional description and
error, and hands the generated ids to its child so the control is labelled, described and
validity-flagged without any wiring at the call site.

```tsx
import { Field } from '@cafekery/oxide-ui'

<Field label="Slug" description="Lowercase letters and dashes only." error="Already taken.">
  {({ id, describedBy, errorId, invalid }) => (
    <input
      id={id}
      aria-describedby={describedBy}
      aria-errormessage={errorId}
      aria-invalid={invalid || undefined}
    />
  )}
</Field>
```

`children` is a render prop, not a node — the control receives the ids directly instead of reading
them from context.

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | — | Rendered as uppercase mono. |
| `description` | `ReactNode` | — | Sits between label and control. |
| `error` | `ReactNode` | — | Sits below the control; presence sets `invalid`. |
| `required` | `boolean` | `false` | Adds an `*` marker, hidden from assistive tech since the control itself carries `required`. |
| `group` | `boolean` | `false` | For composite controls (radiogroup, listbox): renders the label as a `span` so it can be referenced with `aria-labelledby` instead of a dangling `htmlFor`. |
| `className` | `string` | — | Merged onto the wrapping column. |
| `children` | `(control: FieldControl) => ReactNode` | — | Receives the wiring. |

## `FieldControl`
| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Put on the control; the label's `htmlFor` already points here. |
| `labelId` | `string` | Use with `aria-labelledby` when `group` is set. |
| `descriptionId` | `string \| undefined` | Only when a description is rendered. |
| `errorId` | `string \| undefined` | Use with `aria-errormessage`. |
| `describedBy` | `string \| undefined` | Description and error ids, space-separated. |
| `invalid` | `boolean` | True when an error is present. |

The error id is referenced from both `aria-errormessage` and `aria-describedby`: the former is the
precise mapping, the latter guarantees screen readers that ignore it still announce the message.
