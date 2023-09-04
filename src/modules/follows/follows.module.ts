import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsController } from './follows.controller';
import { FollowsRepository } from './follows-repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FollowsController],
  providers: [
    FollowsService,
    { provide: FollowsRepository, useClass: FollowsService },
  ],
})
export class FollowsModule {}
