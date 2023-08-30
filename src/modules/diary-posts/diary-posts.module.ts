import { Module } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { DiaryPostsController } from './diary-posts.controller';

@Module({
  controllers: [DiaryPostsController],
  providers: [DiaryPostsService]
})
export class DiaryPostsModule {}
