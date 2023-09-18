import { Module } from '@nestjs/common';
import { DiaryPostLikesService } from './diary-post-likes.service';
import { DiaryPostLikesController } from './diary-post-likes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryPostLikesController],
  providers: [DiaryPostLikesService],
})
export class DiaryPostLikesModule {}
