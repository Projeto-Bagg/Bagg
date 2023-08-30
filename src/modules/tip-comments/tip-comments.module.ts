import { Module } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { TipCommentsController } from './tip-comments.controller';

@Module({
  controllers: [TipCommentsController],
  providers: [TipCommentsService]
})
export class TipCommentsModule {}
