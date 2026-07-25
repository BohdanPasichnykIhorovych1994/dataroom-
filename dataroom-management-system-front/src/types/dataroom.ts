export type NodeId = string

export type FolderNode = {
  id: NodeId
  type: 'folder'
  name: string
  parentId: NodeId | null
  createdAt: number
  updatedAt: number
}

export type FileNode = {
  id: NodeId
  type: 'file'
  name: string
  parentId: NodeId | null
  size: number
  mimeType: 'application/pdf'
  createdAt: number
  updatedAt: number
}

export type DataroomNode = FolderNode | FileNode

export type ParentKey = NodeId | null
