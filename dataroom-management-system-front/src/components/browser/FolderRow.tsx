import { Folder } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NodeActionsMenu } from '@/components/browser/NodeActionsMenu'
import { formatDate } from '@/helpers'
import type { FolderNode } from '@/types'

type FolderRowProps = {
  folder: FolderNode
  onOpen?: () => void
  onRename: () => void
  onDelete: () => void
}

export function FolderRow({ folder, onOpen, onRename, onDelete }: FolderRowProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-colors hover:border-border hover:bg-accent/50">
      <Link
        to={`/folder/${folder.id}`}
        className="absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open folder ${folder.name}`}
        onClick={() => onOpen?.()}
      />
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Folder className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{folder.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          Folder · {formatDate(folder.updatedAt)}
        </p>
      </div>
      <div className="relative z-10">
        <NodeActionsMenu
          node={folder}
          onRename={onRename}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
