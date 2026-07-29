# Oxide UI

The shared React component library behind Cafekery's apps. One place for the design
system, so a project consumes it instead of rebuilding it.

Dark-first, token-driven, dense. Built on React 19, Tailwind v4 and Radix.

## Install

```sh
bun add github:Cafekery/OxideUI
```

The package builds itself on install, so there is nothing to check in and nothing to
publish.

## Use it

Import the stylesheet once, at the top of your app's own CSS, and tell Tailwind to scan the
package — it only emits classes it can see, and the compiled components live outside your
source tree:

```css
@import '@cafekery/oxide-ui/styles';
@source '../node_modules/@cafekery/oxide-ui/dist';
```

Wrap the app once so navigation components can render your router's link:

```tsx
import { OxideProvider, TooltipProvider, Toaster } from '@cafekery/oxide-ui'
import { Link } from '@tanstack/react-router'

export function Root({ children }) {
  return (
    <OxideProvider link={Link}>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </OxideProvider>
  )
}
```

Then use it:

```tsx
import { Button, Card, CardBody, TextField, toast } from '@cafekery/oxide-ui'

<Card>
  <CardBody className="grid gap-3">
    <TextField label="Project name" placeholder="quicksilver" />
    <Button onClick={() => toast.success('Saved')}>Save</Button>
  </CardBody>
</Card>
```

## The gallery

Every component has stories. Run the gallery to browse, theme, resize and drive them:

```sh
bun install
bun run dev
```

It renders each story in an isolated frame, generates live controls from the story's args,
logs callback props as they fire, and puts the current story and its edited args in the URL
— so a link reproduces exactly what you are looking at.

## Docs

- [Getting started](docs/getting-started.md) — install, wire up, first component
- [Conventions](docs/conventions.md) — props, `className`, tokens, theming, a11y
- [Theming](docs/theming.md) — tokens, light/dark, swapping the accent
- [Components](docs/components) — one page per component

## Layout

```
src/
  primitives/   button, badge, card, avatar, spinner, skeleton, progress, copy, divider, kbd
  forms/        field, text, textarea, checkbox, radio, select, switch, number
  overlays/     modal, sheet, popover, tooltip, menu, toast
  data/         table, pagination, property list, filter bar
  charts/       area, line, bar, sparkline
  navigation/   app shell, sidebar, nav item, top bar, breadcrumbs, page header, tabs
  feedback/     empty state, error state, route progress, loading overlay
  icons/        the library's own control glyphs
  lib/          cn, provider, hooks
styles/         tokens, semantic roles, utilities, base
workbench/      the gallery
docs/           written documentation
```

## Working on it

```sh
bun run dev       # gallery
bun run test      # vitest
bun run verify    # lint, tokens, types, build, tests
```

`verify` is what CI runs and what must pass before a change lands.
