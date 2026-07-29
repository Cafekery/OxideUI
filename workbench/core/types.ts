import type { ReactElement } from 'react'
import type {
  AnyComponent,
  ArgType,
  ControlKind,
  Decorator,
  StoryParameters,
} from '../csf'

export type { AnyComponent, ArgType, ControlKind, Decorator, StoryParameters }

export type Args = Record<string, unknown>

export type PreparedStory = {
  id: string
  /** Display name, e.g. `Primary Large`. */
  name: string
  /** Slash-delimited sidebar path, e.g. `Primitives/Button`. */
  title: string
  importPath: string
  component?: AnyComponent
  initialArgs: Args
  argTypes: Record<string, ArgType>
  decorators: Decorator[]
  parameters: StoryParameters
  render: (args: Args) => ReactElement
}

/** Sidebar entry: everything the chrome needs without evaluating a story. */
export type IndexEntry = Pick<PreparedStory, 'id' | 'name' | 'title' | 'importPath'> & {
  initialArgs: Args
  argTypes: Record<string, ArgType>
}

export type TreeNode = {
  id: string
  name: string
  depth: number
} & ({ kind: 'group'; children: TreeNode[] } | { kind: 'story'; storyId: string })

export type Globals = {
  theme: 'dark' | 'light'
  /** Preview width in px; `null` fills the canvas. */
  viewport: number | null
}

export type ActionEvent = {
  id: string
  name: string
  args: string[]
  at: number
}

/** Preview API hung off the iframe's window; the chrome calls it directly. */
export type PreviewApi = {
  index: IndexEntry[]
  render: (storyId: string, args: Args, globals: Globals) => void
}

/** Chrome API hung off the top window; the preview iframe calls it directly. */
export type ChromeApi = {
  onReady: (api: PreviewApi) => void
  onAction: (event: ActionEvent) => void
}

declare global {
  interface Window {
    __oxidePreview?: PreviewApi
    __oxideChrome?: ChromeApi
  }
}
