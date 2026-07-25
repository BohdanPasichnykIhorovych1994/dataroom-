import { FileText } from 'lucide-react'
import { NodeActionsMenu } from '@/components/browser/NodeActionsMenu'
import { formatBytes, formatDate } from '@/helpers'
import type { FileNode } from '@/types'

type FileRowProps = {
  file: FileNode
  onOpen: () => void
  onRename: () => void
  onDelete: () => void
  onDownload: () => void
}

export function FileRow({
  file,
  onOpen,
  onRename,
  onDelete,
  onDownload,
}: FileRowProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/50">
      <button
        type="button"
        className="absolute inset-0 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onOpen}
        aria-label={`Preview ${file.name}`}
      />
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          PDF · {formatBytes(file.size)} · {formatDate(file.updatedAt)}
        </p>
      </div>
      <div className="relative z-10">
        <NodeActionsMenu
          node={file}
          onRename={onRename}
          onDelete={onDelete}
          onPreview={onOpen}
          onDownload={onDownload}
        />
      </div>
    </div>
  )
}
