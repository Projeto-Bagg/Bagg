import { Module } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { DiaryPostsController } from './diary-posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { DiaryPostsRepository } from './diary-posts-repository';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryPostsController],
  providers: [
    DiaryPostsService,
    { provide: DiaryPostsRepository, useClass: DiaryPostsService },
  ],
})
export class DiaryPostsModule {}
