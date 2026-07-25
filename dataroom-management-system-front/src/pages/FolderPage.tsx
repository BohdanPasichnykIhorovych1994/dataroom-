import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Toolbar } from "@/components/layout/Toolbar";
import { NodeList } from "@/components/browser/NodeList";
import { NameDialog } from "@/components/dialogs/NameDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { PdfPreviewDrawer } from "@/components/preview/PdfPreviewDrawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  useCurrentFolderId,
  useFolderChildren,
} from "@/hooks/useFolderNavigation";
import { useSearchNodes } from "@/hooks/useSearchNodes";
import { downloadBlob, isPdfFile, cn, sortNodesBy } from "@/helpers";
import {
  APP_ROUTE,
  DATA_TRANSFER_TYPE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  DROP_EFFECT,
  EMPTY_VARIANT,
  folderRoute,
  NODE_TYPE,
} from "@/constants";
import { AnimatePresence, Fade } from "@/motion";
import { useDataroom } from "@/store/DataroomContext";
import type { DataroomNode, FileNode, SORT_DIRECTION, SORT_FIELD } from "@/types";

export function FolderPage() {
  const navigate = useNavigate();
  const folderId = useCurrentFolderId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    nodesById,
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
  } = useDataroom();
  const children = useFolderChildren(folderId);

  const [query, setQuery] = useState("");
  const searchResults = useSearchNodes(query);
  const isSearching = query.trim().length > 0;
  const [sortBy, setSortBy] = useState<SORT_FIELD>(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(
    DEFAULT_SORT_DIRECTION,
  );

  const displayedNodes = useMemo(() => {
    const source = isSearching ? searchResults : children;
    return sortNodesBy(source, sortBy, sortDirection);
  }, [isSearching, searchResults, children, sortBy, sortDirection]);

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DataroomNode | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DataroomNode | null>(null);
  const [previewFile, setPreviewFile] = useState<FileNode | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const currentFolder = folderId ? nodesById.get(folderId) : null;
  const folderMissing =
    !loading &&
    folderId !== null &&
    (!currentFolder || currentFolder.type !== NODE_TYPE.FOLDER);

  useEffect(() => {
    setQuery("");
  }, [folderId]);

  useEffect(() => {
    if (folderMissing) {
      toast.error("Folder not found");
      navigate(APP_ROUTE.ROOT, { replace: true });
    }
  }, [folderMissing, navigate]);

  const handleUploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (uploading) return;
      const list = Array.from(files);
      if (list.length === 0) return;

      const pdfs = list.filter(isPdfFile);
      const rejected = list.length - pdfs.length;
      if (rejected > 0) {
        toast.error(
          rejected === 1
            ? "Only PDF files are allowed"
            : `${rejected} files skipped — only PDF is allowed`,
        );
      }
      if (pdfs.length === 0) return;

      setUploading(true);
      try {
        for (const file of pdfs) {
          await uploadPdf(folderId, file);
        }
      } finally {
        setUploading(false);
      }
    },
    [folderId, uploadPdf, uploading, setUploading],
  );

  const handleDownload = useCallback(
    async (file: FileNode) => {
      const blob = await getFileBlob(file.id);
      if (!blob) {
        toast.error("File content not found");
        return;
      }
      downloadBlob(blob, file.name);
    },
    [getFileBlob],
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const deleted = await deleteNode(deleteTarget.id);
    setDeleteTarget(null);
    if (!deleted) return;

    if (previewFile && deleted.includes(previewFile.id)) {
      setPreviewFile(null);
    }

    if (folderId && deleted.includes(folderId)) {
      const parentId = deleteTarget.parentId;
      navigate(parentId ? folderRoute(parentId) : APP_ROUTE.ROOT, {
        replace: true,
      });
    }
  }, [deleteTarget, deleteNode, previewFile, folderId, navigate]);

  function onDragEnter(e: DragEvent) {
    if (uploading || isSearching) return;
    e.preventDefault();
    dragDepth.current += 1;
    if (e.dataTransfer.types.includes(DATA_TRANSFER_TYPE.FILES)) setDragging(true);
  }

  function onDragLeave(e: DragEvent) {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  }

  function onDragOver(e: DragEvent) {
    if (uploading || isSearching) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = DROP_EFFECT.COPY;
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (uploading || isSearching) return;
    if (e.dataTransfer.files?.length) {
      await handleUploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <AppShell>
      <Toolbar
        fileInputRef={fileInputRef}
        uploading={uploading}
        searchQuery={query}
        onSearchChange={setQuery}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
        onCreateFolder={() => setCreateOpen(true)}
        onUploadFiles={(files) => void handleUploadFiles(files)}
      />

      <div
        className={cn(
          "relative flex min-h-0 flex-1 flex-col",
          dragging && !uploading && "ring-2 ring-ring ring-inset",
        )}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={(e) => void onDrop(e)}
      >
        <AnimatePresence>
          {dragging && !uploading && (
            <Fade
              key="drop-overlay"
              className="pointer-events-none absolute inset-3 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-primary/5"
            >
              <p className="text-sm font-medium text-primary">
                Drop PDF files to upload
              </p>
            </Fade>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading && (
            <Fade
              key="loading"
              className="flex flex-1 items-center justify-center text-sm text-muted-foreground"
            >
              Loading dataroom…
            </Fade>
          )}

          {!loading && error && (
            <Fade
              key="error"
              className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center"
            >
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" onClick={() => void refresh()}>
                Retry
              </Button>
            </Fade>
          )}

          {!loading && !error && !folderMissing && (
            <Fade
              key={
                isSearching
                  ? EMPTY_VARIANT.SEARCH
                  : `folder:${folderId ?? "root"}`
              }
              className="flex min-h-0 flex-1 flex-col"
            >
              <ScrollArea className="flex-1">
                <NodeList
                  nodes={displayedNodes}
                  listKey={
                    isSearching
                      ? EMPTY_VARIANT.SEARCH
                      : `folder:${folderId ?? "root"}`
                  }
                  emptyVariant={
                    isSearching ? EMPTY_VARIANT.SEARCH : EMPTY_VARIANT.FOLDER
                  }
                  searchQuery={query.trim()}
                  onClearSearch={() => setQuery("")}
                  onOpenFolder={() => setQuery("")}
                  onCreateFolder={() => setCreateOpen(true)}
                  onUpload={() => {
                    if (!uploading && !isSearching)
                      fileInputRef.current?.click();
                  }}
                  onOpenFile={setPreviewFile}
                  onRename={setRenameTarget}
                  onDelete={setDeleteTarget}
                  onDownload={(file) => void handleDownload(file)}
                />
              </ScrollArea>
            </Fade>
          )}
        </AnimatePresence>
      </div>

      <NameDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="New folder"
        description="Create a folder in the current location."
        placeholder="Contracts"
        submitLabel="Create"
        pendingLabel="Creating…"
        onSubmit={async (name) => {
          await createFolder(folderId, name);
        }}
      />

      <NameDialog
        open={!!renameTarget}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
        title={`Rename ${renameTarget?.type === NODE_TYPE.FILE ? NODE_TYPE.FILE : NODE_TYPE.FOLDER}`}
        description="Choose a new name. Duplicates in this folder get a number suffix."
        initialName={renameTarget?.name ?? ""}
        submitLabel="Save"
        pendingLabel="Saving…"
        onSubmit={async (name) => {
          if (!renameTarget) return;
          await renameNode(renameTarget.id, name);
        }}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        name={deleteTarget?.name ?? ""}
        nodeType={deleteTarget?.type ?? NODE_TYPE.FOLDER}
        descendantCount={deleteTarget ? countDescendants(deleteTarget.id) : 0}
        onConfirm={() => void handleDeleteConfirm()}
      />

      <PdfPreviewDrawer
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </AppShell>
  );
}
