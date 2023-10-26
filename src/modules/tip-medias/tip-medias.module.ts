import { Module } from '@nestjs/common';
import { TipMediasService } from './tip-medias.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TipMediasService],
})
export class TipMediasModule {}
