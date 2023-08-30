import { Module } from '@nestjs/common';
import { DiaryPostMediasService } from './diary-post-medias.service';
import { DiaryPostMediasController } from './diary-post-medias.controller';

@Module({
  controllers: [DiaryPostMediasController],
  providers: [DiaryPostMediasService]
})
export class DiaryPostMediasModule {}
