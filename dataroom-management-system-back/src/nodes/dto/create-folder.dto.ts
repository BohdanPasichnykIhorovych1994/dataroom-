import { Transform } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { normalizeParentId } from '../helpers';

export class CreateFolderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @Transform(({ value }) => normalizeParentId(value))
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsMongoId()
  parentId?: string | null;
}
