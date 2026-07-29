import '../styles.css'
import { createRoot, type Root } from 'react-dom/client'
import {
  type Args,
  type Globals,
  type IndexEntry,
  inferControls,
  type PreviewApi,
  prepareModule,
  type StoryModule,
} from '../core'
import { Harness, MissingStory } from './harness'

type Session = { storyId: string; args: Args; globals: Globals }

const container = document.getElementById('preview-root')
if (!container) throw new Error('preview.html is missing #preview-root')

/** `hot.data` survives the re-execution HMR triggers, so the React root and the
 *  visible story outlive an edit instead of remounting from scratch. */
const state: { root?: Root; last?: Session } = import.meta.hot?.data ?? {}
state.root ??= createRoot(container)
const root = state.root

const modules = import.meta.glob<StoryModule>('../../src/**/*.stories.tsx', {
  eager: true,
})

const stories = Object.entries(modules).flatMap(([path, mod]) => prepareModule(path, mod))
const byId = new Map(stories.map((story) => [story.id, story]))

const index: IndexEntry[] = stories.map((story) => ({
  id: story.id,
  name: story.name,
  title: story.title,
  initialArgs: story.initialArgs,
  argTypes: inferControls(story.initialArgs, story.argTypes),
}))

function render(storyId: string, args: Args, globals: Globals) {
  state.last = { storyId, args, globals }
  const story = byId.get(storyId)
  root.render(
    story ? (
      <Harness story={story} args={args} globals={globals} />
    ) : (
      <MissingStory storyId={storyId} />
    ),
  )
}

const api: PreviewApi = { index, render }
window.__oxidePreview = api
window.parent.__oxideChrome?.onReady(api)

if (state.last) {
  render(state.last.storyId, state.last.args, state.last.globals)
} else if (!window.parent.__oxideChrome) {
  const requested =
    new URLSearchParams(window.location.search).get('story') ?? index[0]?.id
  if (requested) {
    render(requested, byId.get(requested)?.initialArgs ?? {}, {
      theme: 'dark',
      viewport: null,
    })
  }
}

import.meta.hot?.accept()
