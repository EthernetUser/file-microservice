import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../../schemas/file.schema';
import { FileService } from './file.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: File.name,
        schema: FileSchema,
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
