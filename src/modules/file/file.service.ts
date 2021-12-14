import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../../schemas/file.schema';
import { Model } from 'mongoose';

const LIMIT = 5;

@Injectable()
export class FileService {
  private readonly logger = new Logger('FileService');
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async uploadFile(file: Express.Multer.File) {
    const createdFile = await this.fileModel.create(file);
    createdFile.isforremove = false;
    this.logger.log(
      `Stamp - ${createdFile.createdAt}, ObjectID - ${createdFile.id}, Type - UPLOAD, Cluster - ${process.pid}`,
    );
    return createdFile.save();
  }

  async getFilesList(page: number) {
    const skip = page * LIMIT;
    return this.fileModel
      .find()
      .where('isforremove')
      .equals(false)
      .skip(skip)
      .limit(LIMIT)
      .sort({ createdAt: -1 });
  }

  async deleteFile(id: string) {
    const file = await this.fileModel.findById(id);
    if (!file) {
      throw new HttpException('File is not founded', HttpStatus.NOT_FOUND);
    }
    if (file.isforremove) {
      throw new HttpException(
        'File is already deleted',
        HttpStatus.BAD_REQUEST,
      );
    }
    file.isforremove = true;
    this.logger.log(
      `Stamp - ${new Date().toDateString()}, ObjectID - ${
        file.id
      }, Type - DELETE, Cluster - ${process.pid}`,
    );
    return { statusCode: HttpStatus.OK };
  }
}
