import { PDF_MIME_TYPE } from '../constants';
import {
  DataroomNodeResponse,
  FileNodeResponse,
  FolderNodeResponse,
  NodeRecord,
} from '../types';
import { parentIdToString } from './parent-id.helper';

export function toNodeResponse(doc: NodeRecord): DataroomNodeResponse {
  const base = {
    id: doc._id.toString(),
    name: doc.name,
    parentId: parentIdToString(doc.parentId),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  if (doc.type === 'folder') {
    return { ...base, type: 'folder' } satisfies FolderNodeResponse;
  }

  return {
    ...base,
    type: 'file',
    size: doc.size ?? 0,
    mimeType: PDF_MIME_TYPE,
  } satisfies FileNodeResponse;
}
