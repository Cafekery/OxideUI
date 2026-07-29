# Conventions

The rules every component in this library follows. Read this once and the rest of the
API is predictable.

## Props

- Props types are exported and named `<Component>Props`.
- Components extend the native props of whatever they render, so `id`, `data-*`, `aria-*`
  and event handlers pass straight through.
- `ref` is an ordinary prop. There is no `forwardRef` anywhere — React 19 removed the need.
- Named exports only. Nothing has a default export.
- Controlled and uncontrolled both work wherever there is state: pass `value` to control it,
  `defaultValue` to seed it.

## `className` is appended, not merged

`cn` joins class strings. It does **not** resolve Tailwind conflicts, so passing
`className="h-8"` to a component whose base class is `h-10` does not reliably win.

The reason is not the join order. Tailwind v4 emits custom `@utility` rules in
**alphabetical order**, and for two classes setting the same property the one emitted later
wins regardless of the order they appear in the `class` attribute. `bg-raise` will outrank
`bg-error-secondary` no matter how you arrange them.

To override a conflicting utility, mark yours important:

```tsx
<Button className="h-8!">Compact</Button>
```

Non-conflicting additions — margin, grid placement, a new colour on an element that has
none — need no suffix and behave as you would expect.

Internally, components never rely on CSS ordering to pick between two states. Enabled and
disabled, checked and unchecked are chosen in JavaScript or expressed as mutually exclusive
`data-state` variants, so a state pair can never silently lose a specificity race.

## Colour and tokens

Use the semantic utilities: `bg-*` for surfaces, `text-*` for content, `border-*`/`ring-*`/
`outline-*` for strokes. The stock Tailwind palette is switched off, so `bg-slate-500`
silently emits nothing — that is deliberate, and it fails loudly in review rather than
quietly shipping an off-palette colour.

**Never use slash-opacity on a semantic utility.** `text-accent/40` compiles to nothing,
because Tailwind only supports the modifier on `@theme` colours and these are `@utility`
rules. Reach for the explicit step instead — `text-accent-disabled`, `text-secondary`,
`border-accent-secondary`. `bun run lint:css` fails the build if one slips in.

## Theming

Dark is the default. Light is `[data-theme='light']` on `<html>`. Every semantic token
flips with it, so components need no per-theme branches.

Accent is the one swappable hue: re-point the twelve `--accent-*` steps and every accent
surface, border and text follows.

## Icons

The bundled glyph set exists to serve the library's own affordances — the chevron in a
select, the close button on a modal. It is deliberately small. Application iconography
belongs in the application, from its own licensed set.

Icons size to `1em` and paint with `currentColor`, so they inherit from the text around them.

## Accessibility

Overlays and form controls are built on Radix, so focus management, dismissal and ARIA are
handled at the primitive level rather than hand-rolled. What the library cannot own is
route-level focus and the keyboard model of your own custom views — those stay yours.

Anything that navigates renders the link component supplied through `OxideProvider`, so the
library never depends on a router.
