import type { DataroomNode, FileNode, FolderNode, NodeId } from '@/types'
import { ApiError, apiBlob, apiJson } from '@/storage/http'

export async function getAllNodes(): Promise<DataroomNode[]> {
  return apiJson<DataroomNode[]>('/api/nodes')
}

export async function createFolder(input: {
  name: string
  parentId: NodeId | null
}): Promise<FolderNode> {
  return apiJson<FolderNode>('/api/nodes/folders', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function uploadFile(input: {
  name: string
  parentId: NodeId | null
  file: File
}): Promise<FileNode> {
  const form = new FormData()
  form.append('file', input.file)
  form.append('name', input.name)
  form.append('parentId', input.parentId ?? '')

  return apiJson<FileNode>('/api/nodes/files', {
    method: 'POST',
    body: form,
  })
}

export async function renameNode(
  id: NodeId,
  name: string,
): Promise<DataroomNode> {
  return apiJson<DataroomNode>(`/api/nodes/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export async function deleteNode(id: NodeId): Promise<NodeId[]> {
  const result = await apiJson<{ deletedIds: NodeId[] }>(
    `/api/nodes/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  )
  return result.deletedIds
}

export async function getBlob(id: NodeId): Promise<Blob | undefined> {
  try {
    return await apiBlob(`/api/nodes/${encodeURIComponent(id)}/content`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return undefined
    throw e
  }
}
