import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { FileUtils } from 'src/utils';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File, fileClass: string): Promise<string> {
    FileUtils.validateFile(file);

    const fileName = FileUtils.formatFileName(fileClass, file.mimetype);
    return new Promise<string>((resolve, reject) => {
      v2.uploader
        .upload_stream(
          { public_id: fileName },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        )
        .end(file.buffer);
    });
  }

  async uploadImages(files: Express.Multer.File[], fileClass: string): Promise<string[]> {
    return Promise.all(files.map(file => this.uploadImage(file, fileClass)));
  }
}
