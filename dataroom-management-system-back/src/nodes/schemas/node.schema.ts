import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { NODES_COLLECTION, PDF_MIME_TYPE } from '../constants';
import { NodeType, PdfMimeType } from '../types';

export type NodeDocument = HydratedDocument<DataroomNodeEntity>;

@Schema({
  collection: NODES_COLLECTION,
  versionKey: false,
})
export class DataroomNodeEntity {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, enum: ['folder', 'file'] })
  type: NodeType;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, default: null, index: true })
  parentId: Types.ObjectId | null;

  @Prop({ required: false, min: 0 })
  size?: number;

  @Prop({ required: false, enum: [PDF_MIME_TYPE] })
  mimeType?: PdfMimeType;

  @Prop({ type: Buffer, required: false, select: false })
  content?: Buffer;

  @Prop({ required: true })
  createdAt: number;

  @Prop({ required: true })
  updatedAt: number;
}

export const DataroomNodeSchema =
  SchemaFactory.createForClass(DataroomNodeEntity);

DataroomNodeSchema.index({ ownerId: 1, parentId: 1, name: 1 });
