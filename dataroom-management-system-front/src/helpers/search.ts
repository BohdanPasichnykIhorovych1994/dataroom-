import type { DataroomNode } from '@/types'
import { sortNodes } from '@/helpers/nodes'

export function filterNodesByQuery(
  nodes: DataroomNode[],
  query: string,
): DataroomNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return nodes
    .filter((node) => node.name.toLowerCase().includes(q))
    .sort(sortNodes)
}
