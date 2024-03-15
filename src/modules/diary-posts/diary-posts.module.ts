import { Module } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { DiaryPostsController } from './diary-posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from 'src/modules/media/media.module';
import { FollowsModule } from 'src/modules/follows/follows.module';

@Module({
  imports: [PrismaModule, MediaModule, FollowsModule],
  controllers: [DiaryPostsController],
  providers: [DiaryPostsService],
})
export class DiaryPostsModule {}
