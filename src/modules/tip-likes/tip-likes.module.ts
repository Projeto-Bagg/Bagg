import { Module } from '@nestjs/common';
import { TipLikesService } from './tip-likes.service';
import { TipLikesController } from './tip-likes.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipLikesController],
  providers: [TipLikesService],
})
export class TipLikesModule {}
