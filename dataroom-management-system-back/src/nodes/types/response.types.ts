import { PdfMimeType } from './node.types';

export type FolderNodeResponse = {
  id: string;
  type: 'folder';
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
};

export type FileNodeResponse = {
  id: string;
  type: 'file';
  name: string;
  parentId: string | null;
  size: number;
  mimeType: PdfMimeType;
  createdAt: number;
  updatedAt: number;
};

export type DataroomNodeResponse = FolderNodeResponse | FileNodeResponse;

export type DeleteNodesResponse = {
  deletedIds: string[];
};

export type FileContentResult = {
  buffer: Buffer;
  name: string;
};
