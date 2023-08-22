import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { JwtModule } from '@nestjs/jwt';
import { PostsRepository } from './posts-repository';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PostsController],
  providers: [
    PostsService,
    { provide: PostsRepository, useClass: PostsService },
  ],
  exports: [PostsService],
})
export class PostsModule {}
