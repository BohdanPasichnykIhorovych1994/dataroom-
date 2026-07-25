import { NODE_TYPE } from '../constants';
import type { PdfMimeType } from './node.types';

export type FolderNodeResponse = {
  id: string;
  type: NODE_TYPE.FOLDER;
  name: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
};

export type FileNodeResponse = {
  id: string;
  type: NODE_TYPE.FILE;
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
