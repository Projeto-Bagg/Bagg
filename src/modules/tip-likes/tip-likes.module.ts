import { Module } from '@nestjs/common';
import { TipLikesService } from './tip-likes.service';
import { TipLikesController } from './tip-likes.controller';

@Module({
  controllers: [TipLikesController],
  providers: [TipLikesService]
})
export class TipLikesModule {}
