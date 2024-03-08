import { Module } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TipCommentsController } from './tip-comments.controller';

@Module({
  imports: [PrismaModule],
  providers: [TipCommentsService],
  controllers: [TipCommentsController],
})
export class TipCommentsModule {}
