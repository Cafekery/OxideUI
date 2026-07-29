import type { CSSProperties } from 'react'
import { Select, Switch } from '../../src/forms'
import { Breadcrumbs, TopBar } from '../../src/navigation'
import { CopyButton } from '../../src/primitives'
import type { Globals, IndexEntry } from '../core'

const VIEWPORTS = [
  { value: 'fill', label: 'Fill' },
  { value: '375', label: 'Mobile 375' },
  { value: '768', label: 'Tablet 768' },
  { value: '1280', label: 'Laptop 1280' },
]

/** The labelled viewport field is taller than the stock bar, and overriding the
 *  token beats fighting the height utility already on the element. */
const TALLER = { '--top-bar-height': '4.5rem' } as CSSProperties

export function Toolbar({
  entry,
  globals,
  onGlobals,
  link,
}: {
  entry: IndexEntry | undefined
  globals: Globals
  onGlobals: (next: Globals) => void
  link: string
}) {
  const crumbs = entry
    ? [...entry.title.split('/').map((label) => ({ label })), { label: entry.name }]
    : [{ label: 'Loading' }]

  return (
    <TopBar
      style={TALLER}
      leading={<span className="text-mono-sm text-default">Oxide UI</span>}
      trailing={
        <>
          <Switch
            label="Light"
            checked={globals.theme === 'light'}
            onCheckedChange={(on) =>
              onGlobals({ ...globals, theme: on ? 'light' : 'dark' })
            }
          />
          <div className="w-44">
            <Select
              label="Viewport"
              options={VIEWPORTS}
              value={globals.viewport === null ? 'fill' : String(globals.viewport)}
              onValueChange={(value) =>
                onGlobals({
                  ...globals,
                  viewport: value === 'fill' ? null : Number(value),
                })
              }
            />
          </div>
          <CopyButton value={link} label="Copy link" copiedLabel="Link copied" />
        </>
      }
    >
      <Breadcrumbs items={crumbs} />
    </TopBar>
  )
}
