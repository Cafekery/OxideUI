import {
  Component,
  type ComponentType,
  createContext,
  type ReactElement,
  type ReactNode,
  use,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { EmptyState, ErrorState } from '../../src/feedback'
import { cn, OxideProvider } from '../../src/lib'
import { Toaster, TooltipProvider } from '../../src/overlays'
import type { Args, Globals, PreparedStory } from '../core'
import { wrapActions } from './actions'

const LAYOUT = {
  centered: 'grid min-h-dvh place-items-center p-6',
  padded: 'min-h-dvh p-6',
  fullscreen: 'grid min-h-dvh',
}

type Slot = { render: (args: Args) => ReactElement; args: Args }
type Thrown = { value: unknown }

const StorySlot = createContext<Slot | null>(null)

/** The decorator chain is memoised per story, so the leaf has to reach the
 *  current args through context or every keystroke in a control remounts it. */
const StoryLeaf = () => {
  const slot = use(StorySlot)
  return slot ? slot.render(slot.args) : null
}

class StoryBoundary extends Component<{ children: ReactNode }, { thrown?: Thrown }> {
  state: { thrown?: Thrown } = {}

  static getDerivedStateFromError(value: unknown) {
    return { thrown: { value } }
  }

  render() {
    const { thrown } = this.state
    if (!thrown) return this.props.children
    return (
      <ErrorState
        title="This story failed to render"
        description="The story threw while rendering. Fix it and save to reload."
        error={thrown.value}
        showDetails
      />
    )
  }
}

export function Harness({
  story,
  args,
  globals,
}: {
  story: PreparedStory
  args: Args
  globals: Globals
}) {
  const slot = useRef<HTMLDivElement>(null)
  const [filled, setFilled] = useState<string | null>(null)

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = globals.theme
  }, [globals.theme])

  /** Centring shrink-wraps the story, and a story sized in percentages (a chart
   *  filling its container) then resolves against nothing and paints at zero
   *  width. Nothing in CSS distinguishes that from a genuinely small component,
   *  so measure once per story and hand those a definite width instead. */
  useLayoutEffect(() => {
    if (filled === story.id) return
    const roots = slot.current ? [...slot.current.children] : []
    if (
      roots.length > 0 &&
      roots.every((root) => root.getBoundingClientRect().width === 0)
    ) {
      setFilled(story.id)
    }
  })

  const Decorated = useMemo(
    () =>
      story.decorators.reduce<ComponentType>(
        (Inner, decorate) => () => decorate(Inner),
        StoryLeaf,
      ),
    [story],
  )

  return (
    <OxideProvider>
      <TooltipProvider>
        <div
          ref={slot}
          className={cn(
            LAYOUT[story.parameters.layout ?? 'centered'],
            globals.viewport ? 'mx-auto' : 'w-full',
            filled === story.id ? '[&>*]:w-full' : undefined,
          )}
          style={globals.viewport ? { width: globals.viewport } : undefined}
        >
          <StoryBoundary key={story.id}>
            <StorySlot
              value={{ render: story.render, args: wrapActions(args, story.argTypes) }}
            >
              <Decorated />
            </StorySlot>
          </StoryBoundary>
        </div>
        <Toaster />
      </TooltipProvider>
    </OxideProvider>
  )
}

export function MissingStory({ storyId }: { storyId: string }) {
  return (
    <div className={LAYOUT.centered}>
      <EmptyState
        title="Story not found"
        description={`Nothing is registered as “${storyId}”. It may have been renamed or removed.`}
      />
    </div>
  )
}
