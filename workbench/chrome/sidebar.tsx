import { createContext, Fragment, use, useEffect, useMemo, useRef, useState } from 'react'
import { TextField } from '../../src/forms'
import { ChevronDown, ChevronRight, Search } from '../../src/icons'
import { type LinkComponent, OxideProvider } from '../../src/lib'
import { NavItem, Sidebar, SidebarSection } from '../../src/navigation'
import { Badge } from '../../src/primitives'
import {
  buildTree,
  filterTree,
  type IndexEntry,
  readLocation,
  type TreeNode,
  writeLocation,
} from '../core'

const STORE_KEY = 'oxide-workbench:collapsed'

const readCollapsed = (): Record<string, boolean> => {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

const countStories = (node: TreeNode): number =>
  node.kind === 'story'
    ? 1
    : node.children.reduce((total, child) => total + countStories(child), 0)

function ancestorsOf(
  nodes: TreeNode[],
  storyId: string,
  trail: string[],
): string[] | null {
  for (const node of nodes) {
    if (node.kind === 'story') {
      if (node.storyId === storyId) return trail
      continue
    }
    const found = ancestorsOf(node.children, storyId, [...trail, node.id])
    if (found) return found
  }
  return null
}

const indent = (depth: number) => ({ paddingLeft: depth * 12 })

/** Filtering overrides the persisted collapse state; hidden matches read as no
 *  matches at all. */
const OPEN: Record<string, boolean> = {}

const SelectStory = createContext<(storyId: string) => void>(() => {})

/** Sidebar rows are real links so a story survives a middle-click or a copied
 *  address, but a plain click stays in-page and routes through `replaceState`. */
const StoryLink: LinkComponent = ({ to, children, ...rest }) => {
  const select = use(SelectStory)

  return (
    <a
      href={to}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        const { storyId } = readLocation(to)
        if (storyId) select(storyId)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

function Rows({
  nodes,
  selectedId,
  collapsed,
  onToggle,
}: {
  nodes: TreeNode[]
  selectedId: string | null
  collapsed: Record<string, boolean>
  onToggle: (groupId: string) => void
}) {
  return nodes.map((node) => {
    if (node.kind === 'story')
      return (
        <div key={node.id} style={indent(node.depth)}>
          <NavItem
            to={writeLocation(node.storyId, '')}
            active={node.storyId === selectedId}
          >
            {node.name}
          </NavItem>
        </div>
      )

    const shut = collapsed[node.id] === true

    return (
      <Fragment key={node.id}>
        <div style={indent(node.depth)}>
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            aria-expanded={!shut}
            className="flex h-8 w-full items-center gap-1.5 rounded-lg px-2 text-mono-xs text-tertiary transition hover:bg-hover hover:text-secondary"
          >
            {shut ? (
              <ChevronRight className="shrink-0" />
            ) : (
              <ChevronDown className="shrink-0" />
            )}
            <span className="truncate">{node.name}</span>
            <Badge size="sm" variant="neutral" className="ml-auto">
              {countStories(node)}
            </Badge>
          </button>
        </div>
        {!shut && (
          <Rows
            nodes={node.children}
            selectedId={selectedId}
            collapsed={collapsed}
            onToggle={onToggle}
          />
        )}
      </Fragment>
    )
  })
}

export function GallerySidebar({
  index,
  selectedId,
  onSelect,
}: {
  index: IndexEntry[]
  selectedId: string | null
  onSelect: (storyId: string) => void
}) {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const search = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const full = useMemo(() => buildTree(index), [index])
  const tree = useMemo(() => filterTree(full, query), [full, query])

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(collapsed))
  }, [collapsed])

  // `collapsed` is read but deliberately not a trigger: re-running on every toggle
  // would fight a deliberate collapse of the selected story's group.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    if (!selectedId) return
    const trail = ancestorsOf(full, selectedId, [])
    if (!trail?.some((id) => collapsed[id])) return
    setCollapsed((prev) => {
      const next = { ...prev }
      for (const id of trail) delete next[id]
      return next
    })
  }, [full, selectedId])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || /^(?:INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      )
        return
      event.preventDefault()
      search.current?.focus()
      search.current?.select()
    }
    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const links = () =>
    Array.from(list.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? [])

  const move = (delta: 1 | -1) => {
    const rows = links()
    if (rows.length === 0) return
    const at = rows.findIndex((row) => row === document.activeElement)
    rows[Math.min(rows.length - 1, Math.max(0, at + delta))]?.focus()
  }

  return (
    <Sidebar
      aria-label="Stories"
      onKeyDown={(event) => {
        if (event.target === search.current) {
          if (event.key !== 'Enter') return
          event.preventDefault()
          const first = links()[0]
          first?.focus()
          first?.click()
          return
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          move(1)
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          move(-1)
        }
      }}
    >
      <SidebarSection>
        <TextField
          ref={search}
          type="search"
          label="Search"
          placeholder="Filter stories  /"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leading={<Search />}
        />
      </SidebarSection>

      <SelectStory value={onSelect}>
        <OxideProvider link={StoryLink}>
          <SidebarSection ref={list}>
            <Rows
              nodes={tree}
              selectedId={selectedId}
              collapsed={query.trim() === '' ? collapsed : OPEN}
              onToggle={(groupId) =>
                setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
              }
            />
            {tree.length === 0 && query !== '' && (
              <p className="px-2 text-mono-xs text-tertiary">No matches</p>
            )}
          </SidebarSection>
        </OxideProvider>
      </SelectStory>
    </Sidebar>
  )
}
