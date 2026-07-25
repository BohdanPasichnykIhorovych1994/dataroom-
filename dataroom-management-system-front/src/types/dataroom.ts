import { NODE_TYPE } from "@/constants/node";
import { PDF_MIME } from "@/constants/files";

export type NodeId = string;

export type FolderNode = {
  id: NodeId;
  type: NODE_TYPE.FOLDER;
  name: string;
  parentId: NodeId | null;
  createdAt: number;
  updatedAt: number;
};

export type FileNode = {
  id: NodeId;
  type: NODE_TYPE.FILE;
  name: string;
  parentId: NodeId | null;
  size: number;
  mimeType: typeof PDF_MIME;
  createdAt: number;
  updatedAt: number;
};

export type DataroomNode = FolderNode | FileNode;

export type ParentKey = NodeId | null;
