import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDTO } from './upload.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("/")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: FileDTO) {

    try {
      if(!file || !file.originalname || !file.mimetype) {
        throw new BadRequestException('Invalid file provided.');
      }
      
      const fileSizeLimitInBytes = 10 * 1024 * 1024; // 10mb
      
      if(file.size > fileSizeLimitInBytes) {
        throw new BadRequestException('File size exceeds the limit.');
      }

      const result = await this.uploadService.upload(file);
  
      console.log(result)
      return result;
    } catch (error) {
      console.error('Error during file upload:', error)
      
      if(error instanceof BadRequestException) {
        return { message: error.message}
      }

      return { message: 'Internal server error!'};
    }
  }
}
