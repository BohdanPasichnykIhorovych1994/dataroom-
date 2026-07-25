import { FolderRow } from "@/components/browser/FolderRow";
import { FileRow } from "@/components/browser/FileRow";
import { EmptyState } from "@/components/browser/EmptyState";
import { EMPTY_VARIANT } from "@/constants";
import { isFile, isFolder } from "@/helpers";
import { AnimatePresence, Fade } from "@/motion";
import type { DataroomNode, FileNode } from "@/types";

type NodeListProps = {
  nodes: DataroomNode[];
  emptyVariant?: EMPTY_VARIANT;
  searchQuery?: string;
  listKey?: string;
  onCreateFolder: () => void;
  onUpload: () => void;
  onClearSearch?: () => void;
  onOpenFolder?: () => void;
  onOpenFile: (file: FileNode) => void;
  onRename: (node: DataroomNode) => void;
  onDelete: (node: DataroomNode) => void;
  onDownload: (file: FileNode) => void;
};

export function NodeList({
  nodes,
  emptyVariant = EMPTY_VARIANT.FOLDER,
  searchQuery = "",
  listKey = "list",
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
      <AnimatePresence mode="wait">
        <Fade key={`empty-${listKey}-${emptyVariant}`}>
          <EmptyState
            variant={emptyVariant}
            query={searchQuery}
            onCreateFolder={onCreateFolder}
            onUpload={onUpload}
            onClearSearch={onClearSearch}
          />
        </Fade>
      </AnimatePresence>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 p-2 sm:p-3">
      <AnimatePresence initial={false}>
        {nodes.map((node) => {
          if (isFolder(node)) {
            return (
              <Fade key={`${node.id}:${node.name}`}>
                <FolderRow
                  folder={node}
                  onOpen={onOpenFolder}
                  onRename={() => onRename(node)}
                  onDelete={() => onDelete(node)}
                />
              </Fade>
            );
          }
          if (isFile(node)) {
            return (
              <Fade key={`${node.id}:${node.name}`}>
                <FileRow
                  file={node}
                  onOpen={() => onOpenFile(node)}
                  onRename={() => onRename(node)}
                  onDelete={() => onDelete(node)}
                  onDownload={() => onDownload(node)}
                />
              </Fade>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
}
