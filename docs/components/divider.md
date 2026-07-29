# Divider

A one-pixel rule between sections or between items in a row.

```tsx
import { Divider } from '@cafekery/oxide-ui'

<Divider />
<Divider orientation="vertical" />
```

## Vertical dividers

A vertical divider is `h-full`, so it takes its height from the row it sits in. In a flex row
with no fixed height that resolves to nothing and the divider disappears. Give the row a
height, or `items-stretch` so the divider matches its tallest sibling.

```tsx
<div className="flex items-stretch gap-3">
  <span>Draft</span>
  <Divider orientation="vertical" />
  <span>Published</span>
</div>
```

This is the one thing that trips people up.

## Accessibility

It renders an `<hr>`, whose implicit role is already `separator`, plus a matching
`aria-orientation`. `role` and `aria-orientation` are `Omit`ted from the props type, so the
separator semantics cannot be overridden.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical needs a height from its parent |

Plus native `<hr>` props, except `role` and `aria-orientation`.
