import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
const fs = require('fs');
const path = require('path');

const LIMIT = 5;

@Injectable()
export class FileService {
  private readonly logger = new Logger('FileService');
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async uploadFile(file: Express.Multer.File) {
    const createdFile = await this.fileModel.create(file);
    createdFile.deleted = false;
    this.logger.log(
      `Stamp - ${new Date().toLocaleDateString()}, ObjectID - ${
        createdFile.id
      }, Type - UPLOAD, Cluster - ${process.pid}`,
    );
    await createdFile.save();
    return { statusCode: HttpStatus.OK };
  }

  async getFilesList(page: number) {
    const skip = page * LIMIT;
    return this.fileModel
      .find({}, ['filename', 'size', 'createdAt'])
      .where('deleted')
      .equals(false)
      .skip(skip)
      .limit(LIMIT)
      .sort({ createdAt: -1 });
  }

  async markAsDeleted(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new HttpException('File is not founded', HttpStatus.NOT_FOUND);
    }
    if (file.deleted) {
      throw new HttpException(
        'File is already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    file.deleted = true;
    file.save();
    this.logger.log(
      `Stamp - ${new Date().toLocaleDateString()}, ObjectID - ${
        file.id
      }, Type - DELETE, Cluster - ${process.pid}`,
    );
    return { statusCode: HttpStatus.OK };
  }

  @Cron('0 30 23 * * *')
  async deleteMarkedFiles() {
    const files = await this.fileModel.find().where('deleted').equals(true);
    for (const file of files) {
      fs.rmSync(path.join(__dirname, '..', '..', '..', (await file).path));
      await (await file).remove();
    }
    this.logger.log('Marked files are removed');
  }
}
