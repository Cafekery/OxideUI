/* Fails the build on Tailwind classes that silently compile to nothing.

   Semantic utilities are declared with `@utility`, which does not support the
   slash-opacity modifier, so `text-accent` followed by a slash and a number
   emits no CSS at all — the style is lost with no error and no visual warning.
   Use the explicit `-secondary` / `-tertiary` / `-disabled` token step instead.

   Only compiled sources are scanned, and comments are stripped first, so
   documentation is free to show the anti-pattern verbatim. */

import { Glob } from 'bun'

const utilities = await Bun.file('styles/utilities.css').text()
const declared = [
  ...utilities.matchAll(/@utility\s+((?:bg|text|border|ring|outline)-[\w-]+)/g),
]
  .map((m) => m[1] as string)
  .sort((a, b) => b.length - a.length)

if (declared.length === 0)
  throw new Error('no semantic utilities found in styles/utilities.css')

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const OFFENDER = new RegExp(
  String.raw`\b(?:${declared.map(escapeRe).join('|')})\/\d+`,
  'g',
)

const stripComments = (source: string) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_, lead) => lead)

const failures: string[] = []

for (const dir of ['src', 'styles', 'workbench']) {
  for await (const file of new Glob('**/*.{ts,tsx,css}').scan({ cwd: dir })) {
    const path = `${dir}/${file}`
    const lines = stripComments(await Bun.file(path).text()).split('\n')
    lines.forEach((line, i) => {
      for (const hit of line.matchAll(OFFENDER))
        failures.push(`${path}:${i + 1}  ${hit[0]}`)
    })
  }
}

if (failures.length > 0) {
  console.error(
    `Slash-opacity on semantic utilities emits no CSS.\nUse a -secondary / -tertiary / -disabled token instead.\n\n${failures.join('\n')}\n`,
  )
  process.exit(1)
}

console.log(`tokens ok`)
