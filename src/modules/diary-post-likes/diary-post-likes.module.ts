import { Module } from '@nestjs/common';
import { DiaryPostLikesService } from './diary-post-likes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DiaryPostLikesService],
  exports: [DiaryPostLikesService],
})
export class DiaryPostLikesModule {}
