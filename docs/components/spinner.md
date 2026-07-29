# Spinner

An indeterminate loading indicator for work with no measurable progress. If you can measure
it, use [`ProgressBar`](./progress-bar.md) instead.

```tsx
import { Spinner } from '@cafekery/oxide-ui'

<Spinner size="lg" label="Loading results" />
```

## Sizing and colour

The `<svg>` strokes with `currentColor`, so it takes the colour of whatever it sits in —
tint it from the parent rather than on the spinner itself.

```tsx
<span className="text-secondary">
  <Spinner />
</span>
```

## Inside buttons

`Button` and `IconButton` render a correctly sized `Spinner` for you when you pass
`loading`, so you rarely place one in a button yourself.

```tsx
<Button loading>Save</Button>
```

## Accessibility

The spinner is `role="status"` and `label` is its accessible name — a string, never painted
on screen. It defaults to `'Loading'`; override it when a page has more than one spinner
and "Loading" alone would be ambiguous.

Under reduced motion the rotation stops and the arc stays visible as a static mark, so the
indicator is still legible rather than vanishing.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'base' \| 'lg'` | `'base'` | `12px`, `16px`, `24px` square |
| `label` | `string` | `'Loading'` | Accessible name; visually silent |

Plus native `<svg>` props.
