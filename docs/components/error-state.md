# ErrorState

The block shown in place of content that failed to load. Calm generic copy by
default, an optional retry action, and the thrown value kept out of sight.

```tsx
import { ErrorState } from '@cafekery/oxide-ui'

<ErrorState
  title="Could not load instances"
  description="The project may still be provisioning. Retry in a moment."
  error={error}
  onRetry={refetch}
/>
```

## Props
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `title` | `string` | `'Something went wrong'` | |
| `description` | `string` | `'This content could not be loaded. Try again in a moment.'` | |
| `error` | `unknown` | — | Never displayed unless `showDetails` is true. |
| `showDetails` | `boolean` | `false` | Reveals `error` inside a collapsed `<details>`. |
| `onRetry` | `() => void` | — | Renders a secondary Retry button when given. |

Plus native `<div>` props.

## Never leak the error

Passing `error` on its own does nothing visible. A thrown value routinely carries a
request URL, a stack, a connection string or a token, so it is only reachable
through `showDetails`, and only inside a collapsed `<details>` labelled
"Technical detail".

```tsx
<ErrorState error={error} />                 // copy stays generic
<ErrorState error={error} showDetails />     // collapsed technical detail
```

Turn `showDetails` on for internal tooling and local development; leave it off
anywhere an end user can see the screen.

Any value is accepted. An `Error` renders its stack, a string renders as-is, and
anything else is JSON-formatted. Circular and hostile values (a throwing
`toJSON`, for instance) fall back to a placeholder rather than throwing.
