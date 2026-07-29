import { createElement } from 'react'
import { startCase, titleFromPath, toId } from './id'
import type {
  AnyComponent,
  Args,
  ArgType,
  Decorator,
  PreparedStory,
  StoryParameters,
} from './types'

export type StoryModule = { default?: unknown } & Record<string, unknown>

type Meta = {
  component?: AnyComponent
  title?: string
  args?: Args
  argTypes?: Record<string, ArgType>
  decorators?: Decorator[]
  parameters?: StoryParameters
}

type Story = {
  name?: string
  args?: Args
  argTypes?: Record<string, ArgType>
  decorators?: Decorator[]
  parameters?: StoryParameters
  render?: PreparedStory['render']
}

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

/** Drops `undefined` values, so a story naming a key without giving it a value
 *  cannot blank the one it inherits from meta. */
const defined = (over: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(over).filter(([, value]) => value !== undefined))

/** Merges one level of nesting, which is all either caller can reach:
 *  `StoryParameters` is flat and an `ArgType` holds no nested objects, so
 *  `argTypes[name].control` is the deepest key that exists. */
export const deepMerge = <T extends Record<string, unknown>>(
  base: T,
  over: Record<string, unknown>,
): T => {
  const merged: Record<string, unknown> = { ...base, ...defined(over) }
  for (const [key, value] of Object.entries(over)) {
    const existing = base[key]
    if (isPlainObject(existing) && isPlainObject(value))
      merged[key] = { ...existing, ...defined(value) }
  }
  return merged as T
}

// Thrown lazily so one bad story hits the harness error boundary, not the whole index.
const unrenderable =
  (id: string): PreparedStory['render'] =>
  () => {
    throw new Error(`Story "${id}" has no render function and no meta.component.`)
  }

export const prepareModule = (importPath: string, mod: StoryModule): PreparedStory[] => {
  const meta: Meta = isPlainObject(mod.default) ? mod.default : {}
  const title = meta.title || titleFromPath(importPath)
  const component = meta.component
  const prepared: PreparedStory[] = []

  for (const [exportName, value] of Object.entries(mod)) {
    if (exportName === 'default' || exportName === '__esModule') continue
    if (!isPlainObject(value)) continue

    const story: Story = value
    const derivedName = startCase(exportName)
    const id = toId(title, derivedName)

    prepared.push({
      id,
      name: story.name || derivedName,
      title,
      initialArgs: { ...meta.args, ...story.args },
      argTypes: deepMerge(meta.argTypes ?? {}, story.argTypes ?? {}),
      decorators: [...(story.decorators ?? []), ...(meta.decorators ?? [])],
      parameters: deepMerge<StoryParameters>(
        meta.parameters ?? {},
        story.parameters ?? {},
      ),
      render:
        story.render ??
        (component ? (args) => createElement(component, args) : unrenderable(id)),
    })
  }

  return prepared
}
