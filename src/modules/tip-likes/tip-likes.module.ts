import { Module } from '@nestjs/common';
import { TipLikesService } from './tip-likes.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TipLikesService],
})
export class TipLikesModule {}
