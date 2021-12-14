import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ timestamps: true })
export class File {
  @Prop()
  filename: string;

  @Prop()
  originalname: string;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;

  @Prop()
  encoding: string;

  @Prop()
  path: string;

  @Prop()
  isforremove: boolean;

  @Prop()
  createdAt?: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
