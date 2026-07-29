import { sanitize } from './id'
import type { IndexEntry, TreeNode } from './types'

type GroupNode = Extract<TreeNode, { kind: 'group' }>

export const buildTree = (entries: IndexEntry[]): TreeNode[] => {
  const roots: TreeNode[] = []
  const groups = new Map<string, GroupNode>()

  for (const entry of entries) {
    let siblings = roots
    let path = ''
    let depth = 0

    for (const segment of entry.title.split('/').filter(Boolean)) {
      path = path ? `${path}-${sanitize(segment)}` : sanitize(segment)
      let group = groups.get(path)
      if (!group) {
        group = { kind: 'group', id: path, name: segment, depth, children: [] }
        groups.set(path, group)
        siblings.push(group)
      }
      siblings = group.children
      depth += 1
    }

    siblings.push({
      kind: 'story',
      id: entry.id,
      name: entry.name,
      depth,
      storyId: entry.id,
    })
  }

  return roots
}

export const filterTree = (nodes: TreeNode[], query: string): TreeNode[] => {
  const needle = query.trim().toLowerCase()
  if (!needle) return nodes

  const walk = (list: TreeNode[], trail: string): TreeNode[] => {
    const kept: TreeNode[] = []
    for (const node of list) {
      const path = trail ? `${trail}/${node.name}` : node.name
      if (node.kind === 'story') {
        if (path.toLowerCase().includes(needle)) kept.push(node)
        continue
      }
      const children = walk(node.children, path)
      if (children.length > 0) kept.push({ ...node, children })
    }
    return kept
  }

  return walk(nodes, '')
}
