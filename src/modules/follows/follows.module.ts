import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FollowsService } from 'src/modules/follows/follows.service';
import { FollowsController } from 'src/modules/follows/follows.controller';

@Module({
  imports: [PrismaModule],
  providers: [FollowsService],
  controllers: [FollowsController],
  exports: [FollowsService],
})
export class FollowsModule {}
