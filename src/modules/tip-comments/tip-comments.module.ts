import { Module } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { TipCommentsController } from './tip-comments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipCommentsController],
  providers: [TipCommentsService],
})
export class TipCommentsModule {}
