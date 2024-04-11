import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { TipCommentsModule } from 'src/modules/tip-comments/tip-comments.module';
import { FollowsModule } from 'src/modules/follows/follows.module';
import { TipWordsModule } from '../tip-words/tip-words.module';

@Module({
  imports: [
    PrismaModule,
    MediaModule,
    FollowsModule,
    TipCommentsModule,
    TipWordsModule,
  ],
  controllers: [TipsController],
  providers: [TipsService],
})
export class TipsModule {}
