import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CurrentUser, JwtAuthGuard, type JwtPayload } from '../auth';
import { PDF_MIME_TYPE } from './constants';
import { pdfUploadMulterOptions } from './config/multer.config';
import { CreateFolderDto, RenameNodeDto, UploadFileDto } from './dto';
import { MulterExceptionFilter } from './filters/multer-exception.filter';
import { NodesService } from './nodes.service';

@Controller('nodes')
@UseGuards(JwtAuthGuard)
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.nodesService.findAll(user.sub);
  }

  @Post('folders')
  @HttpCode(HttpStatus.CREATED)
  createFolder(@CurrentUser() user: JwtPayload, @Body() dto: CreateFolderDto) {
    return this.nodesService.createFolder(user.sub, dto);
  }

  @Post('files')
  @HttpCode(HttpStatus.CREATED)
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(FileInterceptor('file', pdfUploadMulterOptions))
  uploadFile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UploadFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.nodesService.uploadFile(user.sub, dto, file);
  }

  @Patch(':id')
  rename(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: RenameNodeDto,
  ) {
    return this.nodesService.rename(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.nodesService.remove(user.sub, id);
  }

  @Get(':id/content')
  @Header('Content-Type', PDF_MIME_TYPE)
  async getContent(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const { buffer, name } = await this.nodesService.getContent(user.sub, id);
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(name)}"`,
    );
    res.send(buffer);
  }
}
