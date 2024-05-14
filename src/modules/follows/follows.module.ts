import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';

@Module({
  imports: [PrismaModule],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
