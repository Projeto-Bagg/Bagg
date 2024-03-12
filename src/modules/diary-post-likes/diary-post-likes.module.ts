import { Module } from '@nestjs/common';
import { DiaryPostLikesService } from './diary-post-likes.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DiaryPostLikesController } from 'src/modules/diary-post-likes/diary-post-likes.controller';

@Module({
  imports: [PrismaModule],
  providers: [DiaryPostLikesService],
  controllers: [DiaryPostLikesController],
  exports: [DiaryPostLikesService],
})
export class DiaryPostLikesModule {}
