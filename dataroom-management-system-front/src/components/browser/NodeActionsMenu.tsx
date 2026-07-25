import { MoreHorizontal, Pencil, Trash2, Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { DataroomNode } from '@/types'

type NodeActionsMenuProps = {
  node: DataroomNode
  onRename: () => void
  onDelete: () => void
  onPreview?: () => void
  onDownload?: () => void
}

export function NodeActionsMenu({
  node,
  onRename,
  onDelete,
  onPreview,
  onDownload,
}: NodeActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 data-[state=open]:opacity-100"
          aria-label={`Actions for ${node.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {node.type === 'file' && onPreview && (
          <DropdownMenuItem onSelect={onPreview}>
            <Eye />
            Preview
          </DropdownMenuItem>
        )}
        {node.type === 'file' && onDownload && (
          <DropdownMenuItem onSelect={onDownload}>
            <Download />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={onRename}>
          <Pencil />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
