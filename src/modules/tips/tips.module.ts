import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { UsersModule } from 'src/modules/users/users.module';
import { TipCommentsModule } from 'src/modules/tip-comments/tip-comments.module';

@Module({
  imports: [PrismaModule, MediaModule, UsersModule, TipCommentsModule],
  controllers: [TipsController],
  providers: [TipsService],
})
export class TipsModule {}
