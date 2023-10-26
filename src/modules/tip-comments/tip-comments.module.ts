import { Module } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TipCommentsService],
})
export class TipCommentsModule {}
