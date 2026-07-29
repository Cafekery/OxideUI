# Sheet

A full-height dialog anchored to the left or right edge. Reach for it over `Modal` when the
content is a list, a detail pane, or a long form — anything that wants vertical room and
reads as "beside the page" rather than "on top of it". Same Radix Dialog foundation as
`Modal`, so dismissal, focus trapping and scroll locking behave identically.

```tsx
import { Button, Sheet, SheetBody, SheetFooter } from '@cafekery/oxide-ui'

const [open, setOpen] = useState(false)

<Sheet
  open={open}
  onOpenChange={setOpen}
  title="Instance details"
  description="atlas-prod / us-west-1"
  trigger={<Button variant="secondary">Details</Button>}
>
  <SheetBody>…</SheetBody>
  <SheetFooter>
    <Button onClick={() => setOpen(false)}>Save</Button>
  </SheetFooter>
</Sheet>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. The sheet is always controlled. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Fires on Escape, scrim click, and the close button. |
| `title` | `ReactNode` | — | Required. Becomes the dialog's accessible name. |
| `description` | `ReactNode` | — | Rendered under the title and wired to `aria-describedby`. |
| `trigger` | `ReactNode` | — | Rendered as the Radix trigger; focus returns to it on close. |
| `side` | `'right' \| 'left'` | `'right'` | Which edge it is anchored to and slides in from. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the corner close button. |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). Use `w-[32rem]!` to change the fixed width. |

Plus every Radix `Dialog.Content` prop and native `<div>` props.

`SheetBody` and `SheetFooter` are plain `<div>` wrappers and take native `<div>` props.
`SheetBody` is the scroll container and contains overscroll, same as `ModalBody`.

Layers at `--z-side-modal` over a `--z-side-modal-overlay` scrim, so a `Modal` opened from
inside a sheet still lands on top of it.
