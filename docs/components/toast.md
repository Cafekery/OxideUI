# Toast

Transient confirmation of something that already happened, stacked bottom-right. Use it for
outcomes the user does not need to acknowledge; anything requiring a decision is a `Modal`,
and anything that must stay on screen is an `ErrorState` or a banner in the page.

Mount `Toaster` once, near the root. Then call `toast` from anywhere — no context needed.

```tsx
import { Toaster, toast } from '@cafekery/oxide-ui'

<Toaster />

toast.success('Instance started')
toast.error('Could not start instance', { description: 'No capacity in us-west-1.' })
```

## toast
| Method | Signature | Tint |
| --- | --- | --- |
| `toast.success` | `(message, options?) => ToastId` | accent + circled check |
| `toast.error` | `(message, options?) => ToastId` | error + cross |
| `toast.info` | `(message, options?) => ToastId` | info + circled i |
| `toast.notice` | `(message, options?) => ToastId` | notice + warning triangle |
| `toast.loading` | `(message, options?) => ToastId` | neutral + spinner |
| `toast.dismiss` | `(id?) => void` | Dismisses one toast, or all of them when `id` is omitted. |
| `toast.promise` | `(promise, { loading, success, error }) => void` | Swaps loading → success/error as the promise settles. |

`options` is `{ description?, duration?, id? }`. Passing an existing `id` updates that toast
in place instead of stacking a new one.

`success` and `error` in `toast.promise` may be functions — they receive the resolved value
or the rejection reason.

## Toaster

Takes no props. It reads `[data-theme]` off `<html>` and follows theme changes live, pins
itself to `--z-toast`, and restyles every toast onto the token surfaces (`bg-raise`,
`border-default`, `shadow-toast`), with the flavour tint applied per type.

Only one `Toaster` per app. A second one duplicates every toast.
