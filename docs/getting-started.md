# Getting started

## Install

```sh
bun add github:Cafekery/OxideUI
```

The package has a `prepare` script, so a git install builds itself. React 19 is a peer
dependency; everything else it needs comes with it.

## Wire up the stylesheet

Import the tokens once, in your app's own CSS, then point Tailwind at the built package:

```css
@import '@cafekery/oxide-ui/styles';
@source '../node_modules/@cafekery/oxide-ui/dist';
```

The `@source` line is not optional. Tailwind only emits classes it can actually see, and
the components ship compiled outside your source tree — without it the library renders
unstyled.

The stylesheet disables Tailwind's stock colour palette on purpose. `bg-slate-500` will
emit nothing. Use the semantic tokens instead; see [theming](theming.md).

## Wire up the provider

Navigation components render a link rather than importing a router, so tell them which one
to use. Mount the tooltip provider and the toaster in the same place while you are there:

```tsx
import { OxideProvider, TooltipProvider, Toaster } from '@cafekery/oxide-ui'
import { Link } from '@tanstack/react-router'

<OxideProvider link={Link}>
  <TooltipProvider>
    <App />
    <Toaster />
  </TooltipProvider>
</OxideProvider>
```

Skip `OxideProvider` and links fall back to a plain `<a>`, which is fine for a static page
and wrong for a routed app.

## Set the theme

Dark is the default. For light, set the attribute on the document element:

```ts
document.documentElement.dataset.theme = 'light'
```

Do it before first paint — an inline script in `<head>` reading the stored preference —
or the page flashes dark before switching.

## Fonts

The library does not ship fonts. It reads two optional variables and falls back to the
system stack:

```css
:root {
  --oxide-font-sans: 'Your Sans', sans-serif;
  --oxide-font-mono: 'Your Mono', monospace;
}
```

Self-host the faces. Uppercase mono carries labels, buttons and table headers, so pick a
mono you are happy reading in caps.

## First component

```tsx
import { Button, Card, CardHeader, CardTitle, CardBody } from '@cafekery/oxide-ui'

<Card>
  <CardHeader>
    <CardTitle>Deploy</CardTitle>
  </CardHeader>
  <CardBody>
    <Button variant="primary">Ship it</Button>
  </CardBody>
</Card>
```

Read [conventions](conventions.md) next — particularly how `className` behaves, which is
the one thing that will surprise you.
