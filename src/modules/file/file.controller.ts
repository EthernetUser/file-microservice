import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { fileFilter } from 'src/helpers/fileFilter.helper';
import { generateFileName } from '../../helpers/generateFileName.helper';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: generateFileName,
      }),
      limits: {
        fileSize: 5242880,
      },
      fileFilter: fileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Get('/page/:page')
  async getFilesList(@Param('page') page: string) {
    return this.fileService.getFilesList(Number(page));
  }

  @Delete('/delete/:id')
  async deleteFile(@Param('id') id: string) {
    return this.fileService.markAsDeleted(id);
  }
}
