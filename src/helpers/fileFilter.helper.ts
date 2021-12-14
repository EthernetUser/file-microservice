import { Request } from 'express';

export const fileFilter = (
  req: Request,
  file: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    buffer: Buffer;
  },
  callback: (error: Error | null, acceptedFile: boolean) => void,
) => {
  if (!file.originalname.match(/\.(jpg|png|xlsx)$/)) {
    return callback(new Error('Unsupported file extension'), false);
  }

  return callback(null, true);
};
