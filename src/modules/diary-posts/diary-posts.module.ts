import { Module } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { DiaryPostsController } from './diary-posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryPostsController],
  providers: [DiaryPostsService],
})
export class DiaryPostsModule {}
