# Icons

A deliberately tiny set of control glyphs that exists only to back this library's own
affordances — the chevron in a select, the close button on a modal, the caret on a
sortable table header, the check in a checkbox. It is not an application icon set and
will not grow into one.

**Application iconography should come from your app's own licensed icon set.** Do not add
product icons here; import them where you use them.

```tsx
import { ChevronDown, Close, Search } from '@cafekery/oxide-ui'

<Search />
```

## Sizing and colour

Every icon renders an 18x18 `viewBox` at `width="1em" height="1em"` with
`stroke="currentColor"`. There is no `size` prop: an icon takes the font size and colour
of whatever it sits in, so it always matches adjacent text.

```tsx
<span className="text-sans-16 text-secondary">
  <ChevronDown />
</span>
```

## Accessibility

Icons are decorative and render `aria-hidden` by default. When a glyph is the only content
of a control, override it and supply a label:

```tsx
<button type="button" aria-label="Dismiss">
  <Close />
</button>
```

Or label the glyph itself:

```tsx
<Close aria-hidden={false} aria-label="Dismiss" />
```

## Props

`IconProps` is `ComponentPropsWithRef<'svg'>` — nothing more. `className`, `style`, `ref`,
and ARIA attributes all pass through to the `<svg>`.

## The set

`ChevronDown` `ChevronUp` `ChevronLeft` `ChevronRight` `Check` `Close` `Search` `Minus`
`Plus` `DotsHorizontal` `ExternalLink` `Copy` `AlertTriangle` `InfoCircle` `CircleCheck`
`Calendar` `Filter`
