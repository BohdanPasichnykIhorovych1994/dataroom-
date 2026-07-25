import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'
import type { DataroomNode, FileNode, FolderNode, NodeId, ParentKey } from '@/types'
import {
  ensurePdfExtension,
  isPdfFile,
  sanitizeName,
  sortNodes,
  uniqueNameAmong,
} from '@/helpers'
import {
  createFolder as createFolderRequest,
  deleteNode as deleteNodeRequest,
  getAllNodes,
  getBlob,
  renameNode as renameNodeRequest,
  uploadFile,
} from '@/storage/nodesRepository'

type DataroomContextValue = {
  nodes: DataroomNode[]
  nodesById: Map<NodeId, DataroomNode>
  childrenByParent: Map<ParentKey, DataroomNode[]>
  loading: boolean
  uploading: boolean
  error: string | null
  refresh: () => Promise<void>
  createFolder: (parentId: NodeId | null, name: string) => Promise<FolderNode | null>
  uploadPdf: (parentId: NodeId | null, file: File) => Promise<FileNode | null>
  setUploading: (value: boolean) => void
  renameNode: (id: NodeId, name: string) => Promise<boolean>
  deleteNode: (id: NodeId) => Promise<NodeId[] | null>
  getFileBlob: (id: NodeId) => Promise<Blob | undefined>
  countDescendants: (id: NodeId) => number
  siblingNames: (parentId: NodeId | null, excludeId?: NodeId) => string[]
}

const DataroomContext = createContext<DataroomContextValue | null>(null)

export function DataroomProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<DataroomNode[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const all = await getAllNodes()
      setNodes(all)
      setError(null)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load dataroom'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const nodesById = useMemo(() => {
    const map = new Map<NodeId, DataroomNode>()
    for (const node of nodes) map.set(node.id, node)
    return map
  }, [nodes])

  const childrenByParent = useMemo(() => {
    const map = new Map<ParentKey, DataroomNode[]>()
    for (const node of nodes) {
      const list = map.get(node.parentId) ?? []
      list.push(node)
      map.set(node.parentId, list)
    }
    for (const list of map.values()) {
      list.sort(sortNodes)
    }
    return map
  }, [nodes])

  const siblingNames = useCallback(
    (parentId: NodeId | null, excludeId?: NodeId) =>
      (childrenByParent.get(parentId) ?? [])
        .filter((n) => n.id !== excludeId)
        .map((n) => n.name),
    [childrenByParent],
  )

  const countDescendants = useCallback(
    (id: NodeId) => {
      let count = 0
      const stack = [id]
      while (stack.length > 0) {
        const current = stack.pop()!
        const kids = childrenByParent.get(current) ?? []
        for (const child of kids) {
          count += 1
          if (child.type === 'folder') stack.push(child.id)
        }
      }
      return count
    },
    [childrenByParent],
  )

  const createFolder = useCallback(
    async (parentId: NodeId | null, name: string) => {
      const cleaned = sanitizeName(name)
      if (!cleaned) {
        toast.error('Folder name cannot be empty')
        return null
      }
      try {
        const finalName = uniqueNameAmong(cleaned, siblingNames(parentId))
        const folder = await createFolderRequest({
          name: finalName,
          parentId,
        })
        setNodes((prev) => [...prev, folder])
        if (finalName !== cleaned) {
          toast.message(`Renamed to “${finalName}” to avoid a conflict`)
        } else {
          toast.success('Folder created')
        }
        return folder
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to create folder'
        toast.error(message)
        return null
      }
    },
    [siblingNames],
  )

  const uploadPdf = useCallback(
    async (parentId: NodeId | null, file: File) => {
      if (!isPdfFile(file)) {
        toast.error('Only PDF files are allowed')
        return null
      }
      const cleaned = ensurePdfExtension(sanitizeName(file.name) || 'Untitled.pdf')
      if (!cleaned || cleaned === '.pdf') {
        toast.error('Invalid file name')
        return null
      }
      try {
        const finalName = uniqueNameAmong(cleaned, siblingNames(parentId))
        const node = await uploadFile({
          name: finalName,
          parentId,
          file,
        })
        setNodes((prev) => [...prev, node])
        if (finalName !== cleaned) {
          toast.message(`Saved as “${finalName}” to avoid a conflict`)
        } else {
          toast.success('PDF uploaded')
        }
        return node
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to upload PDF'
        toast.error(message)
        return null
      }
    },
    [siblingNames],
  )

  const renameNode = useCallback(
    async (id: NodeId, name: string) => {
      const node = nodesById.get(id)
      if (!node) return false

      let cleaned = sanitizeName(name)
      if (!cleaned) {
        toast.error('Name cannot be empty')
        return false
      }
      if (node.type === 'file') {
        cleaned = ensurePdfExtension(cleaned)
      }

      try {
        const finalName = uniqueNameAmong(
          cleaned,
          siblingNames(node.parentId, id),
        )
        const updated = await renameNodeRequest(id, finalName)
        setNodes((prev) => prev.map((n) => (n.id === id ? updated : n)))
        if (finalName !== cleaned) {
          toast.message(`Renamed to “${finalName}” to avoid a conflict`)
        } else {
          toast.success('Renamed')
        }
        return true
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to rename'
        toast.error(message)
        return false
      }
    },
    [nodesById, siblingNames],
  )

  const deleteNode = useCallback(async (id: NodeId) => {
    try {
      const deletedIds = await deleteNodeRequest(id)
      const deletedSet = new Set(deletedIds)
      setNodes((prev) => prev.filter((n) => !deletedSet.has(n.id)))
      toast.success('Deleted')
      return deletedIds
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Delete failed'
      toast.error(message)
      return null
    }
  }, [])

  const getFileBlob = useCallback(async (id: NodeId) => getBlob(id), [])

  const value = useMemo<DataroomContextValue>(
    () => ({
      nodes,
      nodesById,
      childrenByParent,
      loading,
      uploading,
      error,
      refresh,
      createFolder,
      uploadPdf,
      setUploading,
      renameNode,
      deleteNode,
      getFileBlob,
      countDescendants,
      siblingNames,
    }),
    [
      nodes,
      nodesById,
      childrenByParent,
      loading,
      uploading,
      error,
      refresh,
      createFolder,
      uploadPdf,
      renameNode,
      deleteNode,
      getFileBlob,
      countDescendants,
      siblingNames,
    ],
  )

  return (
    <DataroomContext.Provider value={value}>{children}</DataroomContext.Provider>
  )
}

export function useDataroom() {
  const ctx = useContext(DataroomContext)
  if (!ctx) {
    throw new Error('useDataroom must be used within DataroomProvider')
  }
  return ctx
}
