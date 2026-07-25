import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  FILE_CONTENT_NOT_FOUND_MESSAGE,
  FILE_NOT_FOUND_MESSAGE,
  NODE_NOT_FOUND_MESSAGE,
  PARENT_MUST_BE_FOLDER_MESSAGE,
  PARENT_NOT_FOUND_MESSAGE,
  PDF_MIME_TYPE,
} from './constants';
import { CreateFolderDto, RenameNodeDto, UploadFileDto } from './dto';
import {
  assertObjectId,
  assertPdfUpload,
  collectSubtreeIds,
  toNodeResponse,
  toObjectId,
} from './helpers';
import { DataroomNodeEntity, NodeDocument } from './schemas/node.schema';
import {
  DataroomNodeResponse,
  DeleteNodesResponse,
  FileContentResult,
  FileNodeResponse,
  FolderNodeResponse,
  NodeRecord,
} from './types';

@Injectable()
export class NodesService {
  constructor(
    @InjectModel(DataroomNodeEntity.name)
    private readonly nodeModel: Model<NodeDocument>,
  ) {}

  async findAll(ownerId: string): Promise<DataroomNodeResponse[]> {
    const ownerObjectId = toObjectId(ownerId);
    const docs = await this.nodeModel
      .find({ ownerId: ownerObjectId })
      .lean<NodeRecord[]>()
      .exec();
    return docs.map(toNodeResponse);
  }

  async createFolder(
    ownerId: string,
    dto: CreateFolderDto,
  ): Promise<FolderNodeResponse> {
    const ownerObjectId = toObjectId(ownerId);
    const parentId = await this.resolveParentId(
      ownerObjectId,
      dto.parentId ?? null,
    );
    const now = Date.now();

    const created = await this.nodeModel.create({
      ownerId: ownerObjectId,
      type: 'folder',
      name: dto.name.trim(),
      parentId,
      createdAt: now,
      updatedAt: now,
    });

    return toNodeResponse(created.toObject()) as FolderNodeResponse;
  }

  async uploadFile(
    ownerId: string,
    dto: UploadFileDto,
    file: Express.Multer.File | undefined,
  ): Promise<FileNodeResponse> {
    const ownerObjectId = toObjectId(ownerId);
    const pdf = assertPdfUpload(file);
    const parentId = await this.resolveParentId(
      ownerObjectId,
      dto.parentId ?? null,
    );
    const now = Date.now();

    const created = await this.nodeModel.create({
      ownerId: ownerObjectId,
      type: 'file',
      name: dto.name.trim(),
      parentId,
      size: pdf.size,
      mimeType: PDF_MIME_TYPE,
      content: pdf.buffer,
      createdAt: now,
      updatedAt: now,
    });

    return toNodeResponse(created.toObject()) as FileNodeResponse;
  }

  async rename(
    ownerId: string,
    id: string,
    dto: RenameNodeDto,
  ): Promise<DataroomNodeResponse> {
    assertObjectId(id);
    const ownerObjectId = toObjectId(ownerId);

    const updated = await this.nodeModel
      .findOneAndUpdate(
        { _id: id, ownerId: ownerObjectId },
        { name: dto.name.trim(), updatedAt: Date.now() },
        { new: true },
      )
      .lean<NodeRecord>()
      .exec();

    if (!updated) {
      throw new NotFoundException(NODE_NOT_FOUND_MESSAGE);
    }

    return toNodeResponse(updated);
  }

  async remove(ownerId: string, id: string): Promise<DeleteNodesResponse> {
    assertObjectId(id);
    const ownerObjectId = toObjectId(ownerId);

    const root = await this.nodeModel
      .findOne({ _id: id, ownerId: ownerObjectId })
      .select('_id')
      .lean()
      .exec();
    if (!root) {
      throw new NotFoundException(NODE_NOT_FOUND_MESSAGE);
    }

    const links = await this.nodeModel
      .find({ ownerId: ownerObjectId })
      .select('_id parentId')
      .lean()
      .exec();

    const deletedIds = collectSubtreeIds(id, links);
    await this.nodeModel.deleteMany({
      ownerId: ownerObjectId,
      _id: { $in: deletedIds.map((nodeId) => toObjectId(nodeId)) },
    });

    return { deletedIds };
  }

  async getContent(ownerId: string, id: string): Promise<FileContentResult> {
    assertObjectId(id);
    const ownerObjectId = toObjectId(ownerId);

    const doc = await this.nodeModel
      .findOne({ _id: id, ownerId: ownerObjectId })
      .select('+content')
      .exec();

    if (!doc || doc.type !== 'file') {
      throw new NotFoundException(FILE_NOT_FOUND_MESSAGE);
    }

    if (!doc.content) {
      throw new NotFoundException(FILE_CONTENT_NOT_FOUND_MESSAGE);
    }

    return { buffer: doc.content, name: doc.name };
  }

  private async resolveParentId(
    ownerId: Types.ObjectId,
    parentId: string | null,
  ): Promise<Types.ObjectId | null> {
    if (!parentId) return null;

    assertObjectId(parentId);

    const parent = await this.nodeModel
      .findOne({ _id: parentId, ownerId })
      .exec();
    if (!parent) {
      throw new NotFoundException(PARENT_NOT_FOUND_MESSAGE);
    }
    if (parent.type !== 'folder') {
      throw new BadRequestException(PARENT_MUST_BE_FOLDER_MESSAGE);
    }

    return parent._id;
  }
}
