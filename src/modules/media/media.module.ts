import { Module } from '@nestjs/common';
import { MediaService } from './media.service';

@Module({
  exports: [MediaService],
  providers: [MediaService],
})
export class MediaModule {}
