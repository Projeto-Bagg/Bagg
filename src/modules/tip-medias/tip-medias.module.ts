import { Module } from '@nestjs/common';
import { TipMediasService } from './tip-medias.service';
import { TipMediasController } from './tip-medias.controller';

@Module({
  controllers: [TipMediasController],
  providers: [TipMediasService]
})
export class TipMediasModule {}
