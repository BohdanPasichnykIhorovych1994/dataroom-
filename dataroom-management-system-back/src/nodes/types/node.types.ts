import { Types } from 'mongoose';
import { NODE_TYPE, PDF_MIME_TYPE } from '../constants';

export type NodeId = string;

export type PdfMimeType = typeof PDF_MIME_TYPE;

export type NodeRecord = {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId;
  type: NODE_TYPE;
  name: string;
  parentId: Types.ObjectId | null;
  size?: number;
  mimeType?: PdfMimeType;
  createdAt: number;
  updatedAt: number;
};

export type NodeParentLink = {
  _id: Types.ObjectId;
  parentId: Types.ObjectId | null;
};

export { NODE_TYPE };
