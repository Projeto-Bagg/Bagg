import { Module } from '@nestjs/common';
import { TipLikesService } from './tip-likes.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TipLikesController } from './tip-likes.controller';

@Module({
  imports: [PrismaModule],
  providers: [TipLikesService],
  controllers: [TipLikesController],
})
export class TipLikesModule {}
