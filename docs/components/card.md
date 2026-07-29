# Card

A bordered, raised panel plus four slot wrappers for its header, title, body, and footer.
All five are stateless layout wrappers — no context, no state, no coupling. Nesting them is
a convention, not a requirement, and you can use any subset.

```tsx
import { Badge, Button, Card, CardBody, CardFooter, CardHeader, CardTitle } from '@cafekery/oxide-ui'

<Card>
  <CardHeader>
    <CardTitle>Batch 4102</CardTitle>
    <Badge variant="notice">Pending</Badge>
  </CardHeader>
  <CardBody>Roast profile locked at 09:12. Awaiting QC sign-off.</CardBody>
  <CardFooter>
    <Button variant="ghost">Discard</Button>
    <Button>Approve</Button>
  </CardFooter>
</Card>
```

## Components
| Component | Renders | Contributes |
| --- | --- | --- |
| `Card` | `<div>` | Large radius, default border, raised surface. No padding — the slots own that. |
| `CardHeader` | `<div>` | Bottom border, `16px`/`12px` padding, and a row that spreads children apart with a gap. Title on the left, actions on the right. |
| `CardTitle` | `<h3>` | Semibold sans type on the raised content colour, margin zeroed. |
| `CardBody` | `<div>` | `16px`/`12px` padding, body sans type on the secondary content colour. |
| `CardFooter` | `<div>` | Top border, `16px`/`12px` padding, and a row that packs children to the trailing edge with a gap. |

Every one takes native `<div>` props (`<h3>` props for `CardTitle`). `className` is appended,
not merged — see [conventions](../conventions.md#classname-is-appended-not-merged).

## Notes

`CardTitle` is fixed at `<h3>`. If the document outline needs a different level, skip it
and put your own heading inside `CardHeader` — the header is an ordinary flex row and does
not care what it holds:

```tsx
<CardHeader>
  <h2 className="m-0 text-sans-semi-md text-raise">Batch 4102</h2>
</CardHeader>
```
