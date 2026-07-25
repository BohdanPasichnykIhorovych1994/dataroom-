import { useRef, type RefObject } from 'react'
import { FolderPlus, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FolderBreadcrumbs } from '@/components/navigation/FolderBreadcrumbs'
import { SearchInput } from '@/components/navigation/SearchInput'
import { SortMenu } from '@/components/navigation/SortMenu'
import { INPUT_TYPE, PDF_EXTENSION, PDF_MIME } from '@/constants'
import type { SORT_DIRECTION, SORT_FIELD } from '@/types'

type ToolbarProps = {
  onCreateFolder: () => void
  onUploadFiles: (files: FileList | File[]) => void
  fileInputRef?: RefObject<HTMLInputElement | null>
  uploading?: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  sortBy: SORT_FIELD
  sortDirection: SORT_DIRECTION
  onSortByChange: (field: SORT_FIELD) => void
  onSortDirectionChange: (direction: SORT_DIRECTION) => void
}

export function Toolbar({
  onCreateFolder,
  onUploadFiles,
  fileInputRef,
  uploading = false,
  searchQuery,
  onSearchChange,
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}: ToolbarProps) {
  const localRef = useRef<HTMLInputElement>(null)
  const inputRef = fileInputRef ?? localRef
  const busy = uploading || Boolean(searchQuery.trim())

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <FolderBreadcrumbs />
      <div className="flex min-w-0 items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={onCreateFolder}
          disabled={busy}
        >
          <FolderPlus />
          New folder
        </Button>
        <Button
          size="sm"
          className="shrink-0"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <Upload />
          {uploading ? 'Uploading…' : 'Upload PDF'}
        </Button>
        <input
          ref={inputRef}
          type={INPUT_TYPE.FILE}
          accept={`${PDF_MIME},${PDF_EXTENSION}`}
          multiple
          className="hidden"
          disabled={busy}
          onChange={(e) => {
            if (e.target.files?.length) {
              onUploadFiles(e.target.files)
              e.target.value = ''
            }
          }}
        />
        <div className="ml-auto flex min-w-0 shrink-0 items-center gap-2">
          <SortMenu
            sortBy={sortBy}
            direction={sortDirection}
            onSortByChange={onSortByChange}
            onDirectionChange={onSortDirectionChange}
          />
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            className="w-[400px] max-w-full"
          />
        </div>
      </div>
      {searchQuery.trim() ? (
        <p className="text-xs text-muted-foreground">
          Click a folder to open it, or a PDF to preview
        </p>
      ) : null}
    </div>
  )
}
