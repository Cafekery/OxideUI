import { useEffect, useMemo, useRef, useState } from 'react'
import {
  type ActionEvent,
  type Args,
  encodeArgs,
  type Globals,
  type PreviewApi,
  readLocation,
  writeLocation,
} from '../core'
import { Canvas } from './canvas'
import { Inspector } from './inspector'
import { GallerySidebar } from './sidebar'
import { Toolbar } from './toolbar'
import { isTypingTarget } from './typing-target'

const ACTION_LIMIT = 100

let announced: PreviewApi | null = null
let readyHook: ((api: PreviewApi) => void) | null = null
let actionHook: ((event: ActionEvent) => void) | null = null

/* Installed at module scope, before React can attach the iframe: the preview's
   script may run ahead of any effect, and a missed `onReady` would leave the
   gallery permanently empty. */
window.__oxideChrome = {
  onReady: (api) => {
    announced = api
    readyHook?.(api)
  },
  onAction: (event) => actionHook?.(event),
}

const opened = readLocation(window.location.search)

/* Keys pressed inside the preview never reach the chrome's window listener, so
   the frame hands back the one shortcut the gallery owns. */
const forwardSearchKey = (frame: HTMLIFrameElement) => {
  const doc = frame.contentDocument
  doc?.addEventListener('keydown', (event) => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
    if (isTypingTarget(doc.activeElement)) return
    event.preventDefault()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
  })
}

export function App() {
  const [api, setApi] = useState<PreviewApi | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [argsById, setArgsById] = useState<Record<string, Args>>({})
  const [globals, setGlobals] = useState<Globals>({ theme: 'dark', viewport: null })
  const [actions, setActions] = useState<ActionEvent[]>([])
  const frame = useRef<HTMLIFrameElement>(null)

  const index = api?.index ?? []
  const entry = index.find((candidate) => candidate.id === selectedId)

  useEffect(() => {
    readyHook = (next) => {
      const known = (id: string | null) =>
        id !== null && next.index.some((candidate) => candidate.id === id)
      setApi(next)
      setSelectedId((current) =>
        known(current)
          ? current
          : ((known(opened.storyId) ? opened.storyId : next.index[0]?.id) ?? null),
      )
    }
    actionHook = (event) => setActions((prev) => [event, ...prev].slice(0, ACTION_LIMIT))
    if (announced) readyHook(announced)
    return () => {
      readyHook = null
      actionHook = null
    }
  }, [])

  const args = useMemo<Args>(() => {
    if (!entry?.acceptsArgs) return {}
    const edited = argsById[entry.id]
    if (edited) return edited
    return entry.id === opened.storyId
      ? { ...entry.initialArgs, ...opened.args }
      : entry.initialArgs
  }, [entry, argsById])

  const search = entry
    ? writeLocation(entry.id, encodeArgs(entry.initialArgs, args))
    : null

  useEffect(() => {
    if (search) history.replaceState(null, '', search)
  }, [search])

  useEffect(() => {
    document.documentElement.dataset.theme = globals.theme
  }, [globals.theme])

  useEffect(() => {
    if (!api || !entry) return
    frame.current?.contentWindow?.__oxidePreview?.render(entry.id, args, globals)
  }, [api, entry, args, globals])

  const writeArgs = (next: Args) => {
    if (entry) setArgsById((prev) => ({ ...prev, [entry.id]: next }))
  }

  const resetArg = (name: string) => {
    if (entry) writeArgs({ ...args, [name]: entry.initialArgs[name] })
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-default">
      <Toolbar
        entry={entry}
        globals={globals}
        onGlobals={setGlobals}
        link={search ? new URL(search, window.location.href).href : window.location.href}
      />
      <div className="flex min-h-0 flex-1">
        <GallerySidebar index={index} selectedId={selectedId} onSelect={setSelectedId} />
        <Canvas viewport={globals.viewport}>
          <iframe
            ref={frame}
            src="preview.html"
            title="Story preview"
            className="h-full w-full"
            onLoad={(event) => forwardSearchKey(event.currentTarget)}
          />
        </Canvas>
        <Inspector
          entry={entry}
          args={args}
          actions={actions}
          onArg={(name, value) => writeArgs({ ...args, [name]: value })}
          onResetArg={resetArg}
          onResetArgs={() => {
            if (entry) writeArgs({ ...entry.initialArgs })
          }}
          onClearActions={() => setActions([])}
        />
      </div>
    </div>
  )
}
