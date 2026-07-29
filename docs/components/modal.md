# Modal

A centred, focus-trapping dialog for a decision that must be resolved before the page
continues — confirming a destructive action, editing one record, reviewing a diff. Built on
Radix Dialog, so Escape, outside-click dismissal, scroll locking, focus trapping and the
`role="dialog"` wiring are handled for you.

```tsx
import { Button, Modal, ModalBody, ModalFooter } from '@cafekery/oxide-ui'

const [open, setOpen] = useState(false)

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Delete project"
  description="This removes the project and every deployment under it."
  trigger={<Button variant="secondary">Delete…</Button>}
>
  <ModalBody>Deleting atlas-prod is permanent.</ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
  </ModalFooter>
</Modal>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. The modal is always controlled. |
| `onOpenChange` | `(open: boolean) => void` | — | Required. Fires on Escape, scrim click, and the close button. |
| `title` | `ReactNode` | — | Required. Becomes the dialog's accessible name. |
| `description` | `ReactNode` | — | Rendered under the title and wired to `aria-describedby`. |
| `trigger` | `ReactNode` | — | Rendered as the Radix trigger. See Focus below. |
| `size` | `'sm' \| 'base' \| 'lg'` | `'base'` | Max width only — height is driven by content. |
| `closeLabel` | `string` | `'Close'` | Accessible name of the corner close button. |
| `className` | `string` | — | Appended to the content panel classes, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). |

Plus every Radix `Dialog.Content` prop (`onEscapeKeyDown`, `onInteractOutside`,
`onCloseAutoFocus`, …) and native `<div>` props.

`ModalBody` and `ModalFooter` are plain `<div>` wrappers and take native `<div>` props.

## Focus

Pass `trigger`. Radix restores focus to that element when the modal closes, which is the
whole point of the prop — open a modal purely from state and focus is left wherever the
user last put it, because there is nothing to return to.

```tsx
<Modal trigger={<Button>Open</Button>} open={open} onOpenChange={setOpen} title="…">
```

## Layout

The panel is a column: header, then whatever you put inside. `ModalBody` is the scroll
container — it takes the remaining height, scrolls on its own, and contains overscroll so a
long modal never scrolls the page behind it. Put `ModalFooter` after it and the actions
stay pinned while the body scrolls.

Layers at `--z-modal` over a `--z-modal-overlay` scrim.
