import { Module } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { DiaryPostsController } from './diary-posts.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from 'src/modules/media/media.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PrismaModule, MediaModule, UsersModule],
  controllers: [DiaryPostsController],
  providers: [DiaryPostsService],
})
export class DiaryPostsModule {}
