import { Module } from '@nestjs/common';
import { BookModule } from './modules/book/book.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [BookModule, UploadModule]
})
export class AppModule {}
