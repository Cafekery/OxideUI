/* Component Story Format, reduced to the parts the gallery actually renders.
   Structurally compatible with CSF3, so stories stay portable. */

import type { ComponentProps, ComponentType, ReactElement } from 'react'

export type ControlKind = 'text' | 'number' | 'boolean' | 'select' | 'color'

export type ArgType = {
  control?: ControlKind
  options?: readonly (string | number)[]
  description?: string
  /** Hide from the controls panel. */
  disable?: boolean
}

export type Decorator = (Story: ComponentType) => ReactElement

export type StoryParameters = {
  layout?: 'centered' | 'padded' | 'fullscreen'
  /** Skip the surrounding padded canvas frame. */
  bare?: boolean
}

// Props are contravariant, so `any` is the only constraint that accepts every component.
// biome-ignore lint/suspicious/noExplicitAny: see above
export type AnyComponent = ComponentType<any>

type ArgsOf<C> = C extends ComponentType<infer P> ? P : Record<string, unknown>

export type Meta<C extends AnyComponent = AnyComponent> = {
  component?: C
  /** Sidebar path, e.g. `Primitives/Button`. Derived from the file path when omitted. */
  title?: string
  args?: Partial<ArgsOf<C>>
  argTypes?: Partial<Record<keyof ArgsOf<C> & string, ArgType>> & Record<string, ArgType>
  decorators?: Decorator[]
  parameters?: StoryParameters
}

type StoryFor<C extends AnyComponent> = {
  name?: string
  args?: Partial<ComponentProps<C>>
  argTypes?: Partial<Record<keyof ComponentProps<C> & string, ArgType>> &
    Record<string, ArgType>
  render?: (args: ComponentProps<C>) => ReactElement
  decorators?: Decorator[]
  parameters?: StoryParameters
}

export type StoryObj<M = Meta> = M extends { component: infer C extends AnyComponent }
  ? StoryFor<C>
  : StoryFor<AnyComponent>
