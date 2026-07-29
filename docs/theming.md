# Theming

## The three namespaces

Every colour decision goes through one of three roles. They share short names because they
never mean the same thing in the same place:

| Namespace | Utilities | Meaning |
| --- | --- | --- |
| surface | `bg-*` | Page, panel and control backgrounds |
| content | `text-*` | Text and icons |
| stroke | `border-*`, `ring-*`, `outline-*` | Borders, focus rings, outlines |

So `bg-accent` is the tinted accent *surface* and `text-accent` is the bright accent
*text* — two different values behind one adjective. That overlap is why these are declared
as `@utility` rules rather than generated from `@theme` colours, and it is why
slash-opacity does not work on them. Use the explicit step:

```
text-accent  text-accent-secondary  text-accent-tertiary  text-accent-disabled
```

## Steps

Each role has a predictable ladder. Surfaces go `-secondary`, `-hover`, `-inverse`;
content goes `-secondary`, `-tertiary`, `-disabled`; strokes go `-secondary`, `-tertiary`,
`-quaternary`. Neutral surfaces run `bg-default` (page), `bg-raise` (panel),
`bg-secondary`, `bg-hover`, `bg-tertiary`.

## Light and dark

Dark is `:root`. Light overrides under `[data-theme='light']` on `<html>`. Every semantic
token is redefined there, so components need no per-theme branches — set the attribute and
the whole tree flips.

For the rare case that needs a genuinely different value per theme (a raw-scale tint chip,
say), there is a `light:` variant:

```tsx
<span className="bg-green-200 light:bg-green-1200" />
```

Prefer a semantic token. Reach for `light:` only when no role expresses what you mean.

## Swapping the accent

Accent is the one themeable hue. Twelve variables point at a base scale; re-point them and
every accent surface, border and text follows:

```css
:root {
  --accent-200: var(--color-purple-200);
  --accent-300: var(--color-purple-300);
  /* … through --accent-1300 */
}
```

Scope it to a selector for a per-section accent. The other roles — error, notice, info,
success, accent-alt — are deliberately fixed to their hues, because "success" turning
purple along with the brand is a bug, not a feature.

## Raw scales

Six hues (`neutral`, `green`, `red`, `yellow`, `blue`, `purple`) in steps `0` and
`50`–`1300` are available as `bg-green-800`, `text-red-700`, and so on. They do not flip
with the theme. They exist for charts and categorical tints — anywhere the colour carries
data rather than meaning. Everything else uses the semantic roles.

## Type

Sans for prose, uppercase mono for labels, buttons, table headers and anything numeric.

```
text-sans-11 … text-sans-65      aliases: text-sans-sm|md|lg|xl|2xl|3xl|4xl|5xl
text-sans-semi-sm|md|lg|xl       medium weight
text-mono-xs|sm|md               UPPERCASE, tabular figures
text-mono-code                   normal case, for code and ids
heading-display|xl|lg|md         responsive headings
```

## Other tokens

Radii are tight: `rounded-sm` 1px, `rounded-md` 2px (the default), `rounded-lg` 4px,
`rounded-xl` 6px.

Shadows are composite and named for their job: `shadow-border`, `shadow-menu`,
`shadow-modal`, `shadow-toast`, `shadow-tooltip`.

Layering uses CSS variables so overlays stack predictably — `--z-popover`, `--z-modal`,
`--z-toast` and friends. Use them via `z-[var(--z-modal)]` rather than inventing numbers.
