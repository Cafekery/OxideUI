# Skeleton

A pulsing grey block that holds the shape of content while it loads.

```tsx
import { Skeleton } from '@cafekery/oxide-ui'

<Skeleton className="h-4 w-24" />
```

## Sizing

`Skeleton` has no intrinsic size: you shape every placeholder with `className`. That is
deliberate — a baked-in height would collide with the caller's on class precedence instead
of losing cleanly, so there is nothing to fight.

```tsx
<div className="flex flex-col gap-2">
  <Skeleton className="h-4 w-32" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-8 w-8 rounded-full" />
</div>
```

The pulse stops under reduced motion; the block stays.

## Accessibility

Skeletons are `aria-hidden`, so assistive tech never sees them. Announce the loading state
separately — on the region that is loading, not on the placeholders.

```tsx
<section aria-busy={loading}>
  {loading ? <Skeleton className="h-4 w-32" /> : <p>{name}</p>}
</section>
```

## Props

`SkeletonProps` is `ComponentPropsWithRef<'div'>` — the component adds no props of its own.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `className` | `string` | — | Appended to the class list, not merged — see [conventions](../conventions.md#classname-is-appended-not-merged). Sizing this component is the whole API. |

Plus native `<div>` props.
