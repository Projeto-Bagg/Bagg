import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PrismaModule, MediaModule, UsersModule],
  controllers: [TipsController],
  providers: [TipsService],
})
export class TipsModule {}
