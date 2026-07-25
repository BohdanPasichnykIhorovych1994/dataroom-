import { FolderPlus, Search, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

type EmptyStateProps = {
  variant?: 'folder' | 'search'
  query?: string
  onCreateFolder?: () => void
  onUpload?: () => void
  onClearSearch?: () => void
}

export function EmptyState({
  variant = 'folder',
  query = '',
  onCreateFolder,
  onUpload,
  onClearSearch,
}: EmptyStateProps) {
  if (variant === 'search') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Search className="size-7" />
        </div>
        <h2 className="text-lg font-semibold tracking-tight">No results</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Nothing matched “{query}”. Try another name.
        </p>
        {onClearSearch && (
          <Button variant="outline" className="mt-6" onClick={onClearSearch}>
            Clear search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <FolderPlus className="size-7" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">This folder is empty</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create a folder or upload a PDF to start organizing your dataroom.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onCreateFolder && (
          <Button onClick={onCreateFolder}>
            <FolderPlus />
            New folder
          </Button>
        )}
        {onUpload && (
          <Button variant="outline" onClick={onUpload}>
            <Upload />
            Upload PDF
          </Button>
        )}
      </div>
    </div>
  )
}
