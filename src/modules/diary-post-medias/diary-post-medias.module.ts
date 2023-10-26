import { Module } from '@nestjs/common';
import { DiaryPostMediasService } from './diary-post-medias.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DiaryPostMediasService],
})
export class DiaryPostMediasModule {}
