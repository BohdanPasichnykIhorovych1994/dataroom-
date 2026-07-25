import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { INVALID_NODE_ID_MESSAGE } from '../constants';

export function assertObjectId(id: string): void {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestException(INVALID_NODE_ID_MESSAGE);
  }
}

export function toObjectId(id: string): Types.ObjectId {
  assertObjectId(id);
  return new Types.ObjectId(id);
}
