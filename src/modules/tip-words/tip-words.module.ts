import { Module } from '@nestjs/common';
import { TipWordsService } from './tip-words.service';
import { TipWordsController } from './tip-words.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipWordsController],
  providers: [TipWordsService],
})
export class TipWordsModule {}
