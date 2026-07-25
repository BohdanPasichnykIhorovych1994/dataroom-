import { FolderRow } from '@/components/browser/FolderRow'
import { FileRow } from '@/components/browser/FileRow'
import { EmptyState } from '@/components/browser/EmptyState'
import { isFile, isFolder } from '@/helpers'
import type { DataroomNode, FileNode } from '@/types'

type NodeListProps = {
  nodes: DataroomNode[]
  emptyVariant?: 'folder' | 'search'
  searchQuery?: string
  onCreateFolder: () => void
  onUpload: () => void
  onClearSearch?: () => void
  onOpenFolder?: () => void
  onOpenFile: (file: FileNode) => void
  onRename: (node: DataroomNode) => void
  onDelete: (node: DataroomNode) => void
  onDownload: (file: FileNode) => void
}

export function NodeList({
  nodes,
  emptyVariant = 'folder',
  searchQuery = '',
  onCreateFolder,
  onUpload,
  onClearSearch,
  onOpenFolder,
  onOpenFile,
  onRename,
  onDelete,
  onDownload,
}: NodeListProps) {
  if (nodes.length === 0) {
    return (
      <EmptyState
        variant={emptyVariant}
        query={searchQuery}
        onCreateFolder={onCreateFolder}
        onUpload={onUpload}
        onClearSearch={onClearSearch}
      />
    )
  }

  return (
    <div className="flex flex-col gap-0.5 p-2 sm:p-3">
      {nodes.map((node) => {
        if (isFolder(node)) {
          return (
            <FolderRow
              key={node.id}
              folder={node}
              onOpen={onOpenFolder}
              onRename={() => onRename(node)}
              onDelete={() => onDelete(node)}
            />
          )
        }
        if (isFile(node)) {
          return (
            <FileRow
              key={node.id}
              file={node}
              onOpen={() => onOpenFile(node)}
              onRename={() => onRename(node)}
              onDelete={() => onDelete(node)}
              onDownload={() => onDownload(node)}
            />
          )
        }
        return null
      })}
    </div>
  )
}
