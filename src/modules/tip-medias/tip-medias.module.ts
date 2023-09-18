import { Module } from '@nestjs/common';
import { TipMediasService } from './tip-medias.service';
import { TipMediasController } from './tip-medias.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipMediasController],
  providers: [TipMediasService],
})
export class TipMediasModule {}
