import { ErrorHelper } from './error.utils';

export class FileUtils {
  private static AllowedMimeType = ['image/jpeg', 'image/png', 'image/gif'];

  static validateFile(file: Express.Multer.File): void {
    if (!this.AllowedMimeType.includes(file.mimetype)) {
      ErrorHelper.BadRequestException(`${file.originalname} has an invalid file type`);
    }
    if (file.size > 10000000) {
      ErrorHelper.BadRequestException(`${file.originalname} should be less than 10MB`);
    }
  }

  static formatFileName(fileClass: string, mimetype: string): string {
    const timeInMilliseconds = new Date().getTime();
    return `${fileClass}/${timeInMilliseconds}.${mimetype.split('/')[1]}`;
  }
}
