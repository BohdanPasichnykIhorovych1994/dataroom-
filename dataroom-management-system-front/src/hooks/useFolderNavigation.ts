import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { DataroomNode, NodeId } from '@/types'
import { useDataroom } from '@/store/DataroomContext'

export function useCurrentFolderId(): NodeId | null {
  const { folderId } = useParams<{ folderId?: string }>()
  return folderId ?? null
}

export function useFolderChildren(parentId: NodeId | null): DataroomNode[] {
  const { childrenByParent } = useDataroom()

  return useMemo(
    () => childrenByParent.get(parentId) ?? [],
    [childrenByParent, parentId],
  )
}

export function useBreadcrumbPath(folderId: NodeId | null) {
  const { nodesById } = useDataroom()

  return useMemo(() => {
    const path: Array<{ id: NodeId; name: string }> = []
    let currentId = folderId
    while (currentId) {
      const node = nodesById.get(currentId)
      if (!node || node.type !== 'folder') break
      path.unshift({ id: node.id, name: node.name })
      currentId = node.parentId
    }
    return path
  }, [folderId, nodesById])
}
