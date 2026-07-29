import { describe, expect, it } from 'vitest'
import { buildTree, filterTree } from './tree'
import type { IndexEntry, TreeNode } from './types'

const entry = (title: string, name: string): IndexEntry => ({
  id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}--${name.toLowerCase()}`,
  name,
  title,
  initialArgs: {},
  argTypes: {},
})

const shape = (nodes: TreeNode[]): unknown =>
  nodes.map((node) =>
    node.kind === 'group'
      ? { [node.name]: shape(node.children) }
      : `${node.name}@${node.depth}`,
  )

describe('buildTree', () => {
  it('nests one group per title segment with stories as leaves', () => {
    const tree = buildTree([
      entry('Primitives/Button', 'Primary'),
      entry('Primitives/Button', 'Ghost'),
      entry('Primitives/Badge', 'Default'),
    ])

    expect(shape(tree)).toEqual([
      { Primitives: [{ Button: ['Primary@2', 'Ghost@2'] }, { Badge: ['Default@2'] }] },
    ])
  })

  it('gives groups the cumulative sanitized path as a stable id', () => {
    const [root] = buildTree([entry('Data Display/Filter Bar', 'Basic')])
    if (root?.kind !== 'group') throw new Error('expected a group root')
    const [child] = root.children
    if (child?.kind !== 'group') throw new Error('expected a nested group')

    expect(root.id).toBe('data-display')
    expect(child.id).toBe('data-display-filter-bar')
    expect(root.depth).toBe(0)
    expect(child.depth).toBe(1)
  })

  it('preserves declaration order rather than sorting alphabetically', () => {
    const tree = buildTree([
      entry('Zeta', 'Second'),
      entry('Alpha', 'First'),
      entry('Zeta', 'Third'),
    ])

    expect(shape(tree)).toEqual([
      { Zeta: ['Second@1', 'Third@1'] },
      { Alpha: ['First@1'] },
    ])
  })

  it('reuses one group node for every entry sharing a path prefix', () => {
    const tree = buildTree([entry('A/B', 'One'), entry('A/C', 'Two')])

    expect(tree).toHaveLength(1)
  })

  it('handles a single-segment title', () => {
    expect(shape(buildTree([entry('Overview', 'Intro')]))).toEqual([
      { Overview: ['Intro@1'] },
    ])
  })

  it('points each leaf at its entry id', () => {
    const [root] = buildTree([entry('Primitives', 'Primary')])
    if (root?.kind !== 'group') throw new Error('expected a group root')
    const [leaf] = root.children

    expect(leaf).toMatchObject({ kind: 'story', storyId: 'primitives--primary' })
  })
})

describe('filterTree', () => {
  const tree = buildTree([
    entry('Primitives/Button', 'Primary'),
    entry('Primitives/Button', 'Ghost'),
    entry('Forms/Select', 'Basic'),
  ])

  it('returns the input untouched for an empty query', () => {
    expect(filterTree(tree, '')).toBe(tree)
    expect(filterTree(tree, '   ')).toBe(tree)
  })

  it('keeps the ancestors of a matching story', () => {
    expect(shape(filterTree(tree, 'ghost'))).toEqual([
      { Primitives: [{ Button: ['Ghost@2'] }] },
    ])
  })

  it('is case-insensitive', () => {
    expect(shape(filterTree(tree, 'GHOST'))).toEqual([
      { Primitives: [{ Button: ['Ghost@2'] }] },
    ])
  })

  it('matches against the full breadcrumb path, not just the story name', () => {
    expect(shape(filterTree(tree, 'forms'))).toEqual([
      { Forms: [{ Select: ['Basic@2'] }] },
    ])
  })

  it('drops groups with no matching descendant', () => {
    expect(filterTree(tree, 'nothing-matches-this')).toEqual([])
  })

  it('does not mutate the input tree', () => {
    const before = JSON.parse(JSON.stringify(tree))
    filterTree(tree, 'ghost')

    expect(JSON.parse(JSON.stringify(tree))).toEqual(before)
  })

  it('returns fresh group nodes rather than the originals', () => {
    const [filtered] = filterTree(tree, 'ghost')

    expect(filtered).not.toBe(tree[0])
  })
})
