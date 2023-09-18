import { Module } from '@nestjs/common';
import { DiaryPostMediasService } from './diary-post-medias.service';
import { DiaryPostMediasController } from './diary-post-medias.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DiaryPostMediasController],
  providers: [DiaryPostMediasService],
})
export class DiaryPostMediasModule {}
