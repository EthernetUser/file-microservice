import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION),
    MulterModule.register({
      dest: './files',
    }),
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
