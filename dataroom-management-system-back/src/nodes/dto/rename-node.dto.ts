import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RenameNodeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;
}
