import { useEffect, useRef, useState } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadBlob } from '@/helpers'
import { useDataroom } from '@/store/DataroomContext'
import type { FileNode } from '@/types'

type PdfPreviewDrawerProps = {
  file: FileNode | null
  onClose: () => void
}

export function PdfPreviewDrawer({ file, onClose }: PdfPreviewDrawerProps) {
  const { getFileBlob } = useDataroom()
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let revoked: string | null = null
    let cancelled = false

    async function load() {
      if (!file) {
        setUrl(null)
        setError(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const blob = await getFileBlob(file.id)
        if (cancelled) return
        if (!blob) {
          setError('File content not found')
          setUrl(null)
          return
        }
        const objectUrl = URL.createObjectURL(blob)
        revoked = objectUrl
        setUrl(objectUrl)
      } catch {
        if (!cancelled) setError('Failed to load PDF')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (revoked) URL.revokeObjectURL(revoked)
    }
  }, [file, getFileBlob])

  useEffect(() => {
    if (!file) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [file, onClose])

  if (!file) return null

  async function handleDownload() {
    const blob = await getFileBlob(file!.id)
    if (!blob) return
    downloadBlob(blob, file!.name)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close preview"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-3xl flex-col border-l border-border bg-background shadow-xl animate-in slide-in-from-right duration-200">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0 flex-1">
            <h2 id="pdf-preview-title" className="truncate text-sm font-semibold">
              {file.name}
            </h2>
            <p className="text-xs text-muted-foreground">PDF preview</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void handleDownload()}>
            <Download />
            Download
          </Button>
          <Button
            ref={closeRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X />
          </Button>
        </header>
        <div className="min-h-0 flex-1 bg-muted/40">
          {loading && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading preview…
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center text-sm text-destructive">
              {error}
            </div>
          )}
          {url && !loading && !error && (
            <iframe
              title={file.name}
              src={url}
              className="h-full w-full border-0"
            />
          )}
        </div>
      </aside>
    </div>
  )
}
