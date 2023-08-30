import { Module } from '@nestjs/common';
import { DiaryPostLikesService } from './diary-post-likes.service';
import { DiaryPostLikesController } from './diary-post-likes.controller';

@Module({
  controllers: [DiaryPostLikesController],
  providers: [DiaryPostLikesService]
})
export class DiaryPostLikesModule {}
