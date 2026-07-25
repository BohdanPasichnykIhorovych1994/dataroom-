import type {
  DataroomNode,
  FileNode,
  FolderNode,
  NodeId,
  SortDirection,
  SortField,
} from '@/types'

export function isFolder(node: DataroomNode): node is FolderNode {
  return node.type === 'folder'
}

export function isFile(node: DataroomNode): node is FileNode {
  return node.type === 'file'
}

function nodeSize(node: DataroomNode): number {
  return node.type === 'file' ? node.size : -1
}

function nodeDate(node: DataroomNode): number {
  return node.updatedAt
}

export function compareNodes(
  a: DataroomNode,
  b: DataroomNode,
  field: SortField = 'name',
  direction: SortDirection = 'asc',
): number {
  if (a.type !== b.type) return a.type === 'folder' ? -1 : 1

  let cmp = 0
  switch (field) {
    case 'size':
      cmp = nodeSize(a) - nodeSize(b)
      break
    case 'date':
      cmp = nodeDate(a) - nodeDate(b)
      break
    case 'name':
    default:
      cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  }

  if (cmp === 0 && field !== 'name') {
    cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  }

  return direction === 'asc' ? cmp : -cmp
}

export function sortNodes(a: DataroomNode, b: DataroomNode): number {
  return compareNodes(a, b, 'name', 'asc')
}

export function sortNodesBy(
  nodes: DataroomNode[],
  field: SortField,
  direction: SortDirection,
): DataroomNode[] {
  return [...nodes].sort((a, b) => compareNodes(a, b, field, direction))
}

export function collectDescendantIds(
  rootId: NodeId,
  allNodes: DataroomNode[],
): NodeId[] {
  const childrenByParent = new Map<NodeId | null, DataroomNode[]>()
  for (const node of allNodes) {
    const list = childrenByParent.get(node.parentId) ?? []
    list.push(node)
    childrenByParent.set(node.parentId, list)
  }

  const result: NodeId[] = []
  const stack: NodeId[] = [rootId]

  while (stack.length > 0) {
    const id = stack.pop()!
    result.push(id)
    const children = childrenByParent.get(id) ?? []
    for (const child of children) {
      stack.push(child.id)
    }
  }

  return result
}
