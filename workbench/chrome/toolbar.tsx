import { Select as SelectPrimitive } from 'radix-ui'
import { Check, ChevronDown } from '../../src/icons'
import { cn } from '../../src/lib/cn'
import { Breadcrumbs, TopBar } from '../../src/navigation'
import { CopyButton, Divider } from '../../src/primitives'
import type { Globals, IndexEntry } from '../core'

const VIEWPORTS = [
  { value: 'fill', label: 'Fill' },
  { value: '375', label: 'Mobile 375' },
  { value: '768', label: 'Tablet 768' },
  { value: '1280', label: 'Laptop 1280' },
]

const THEMES = ['dark', 'light'] as const

const SEGMENT = 'h-full rounded-md px-2 text-mono-xs transition-colors'

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Globals['theme']
  onChange: (next: Globals['theme']) => void
}) {
  return (
    <div className="flex h-8 items-center gap-0.5 rounded-lg border border-default bg-default p-0.5">
      {THEMES.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          onClick={() => onChange(value)}
          className={cn(
            SEGMENT,
            theme === value
              ? 'bg-accent text-accent'
              : 'text-tertiary hover:text-default',
          )}
        >
          {value}
        </button>
      ))}
    </div>
  )
}

function ViewportSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        aria-label="Viewport"
        className="flex h-8 w-36 items-center justify-between gap-2 rounded-lg border border-default bg-default px-2 text-mono-xs text-default transition-colors hover:border-raise focus-visible:outline-2 focus-visible:outline-accent"
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon className="flex shrink-0 text-tertiary">
          <ChevronDown />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className="z-[var(--z-top-bar-dropdown)] min-w-[var(--radix-select-trigger-width)] rounded-lg border border-default bg-raise shadow-menu"
        >
          <SelectPrimitive.Viewport className="p-1">
            {VIEWPORTS.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex h-7 cursor-default select-none items-center gap-2 rounded-md px-2 text-mono-xs text-default outline-none data-[highlighted]:bg-hover"
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="ml-auto flex text-accent">
                  <Check />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

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
      leading={<span className="text-mono-sm text-default">Oxide UI</span>}
      trailing={
        <>
          <ThemeToggle
            theme={globals.theme}
            onChange={(theme) => onGlobals({ ...globals, theme })}
          />
          <ViewportSelect
            value={globals.viewport === null ? 'fill' : String(globals.viewport)}
            onChange={(value) =>
              onGlobals({ ...globals, viewport: value === 'fill' ? null : Number(value) })
            }
          />
          <Divider orientation="vertical" className="mx-1 h-5!" />
          <CopyButton value={link} label="Copy link" copiedLabel="Link copied" />
        </>
      }
    >
      <Breadcrumbs items={crumbs} />
    </TopBar>
  )
}
