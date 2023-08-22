import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostsRepository } from './posts-repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { DeletePostDto } from './dtos/delete-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService implements PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<void> {
    this.prisma.post.create({
      data: {
        thumbnailUrl: createPostDto.thumbnailUrl,
        videoUrl: createPostDto.videoUrl,
        title: createPostDto.title,
        user: {
          connect: {
            id: createPostDto.userId,
          },
        },
      },
    });
  }

  async update(UpdatePostDto: UpdatePostDto): Promise<void> {
    this.prisma.post.update({
      where: { id: UpdatePostDto.id },
      data: UpdatePostDto,
    });
  }

  async delete(DeletePostDto: DeletePostDto): Promise<void> {
    this.prisma.post.delete({
      where: {
        id: DeletePostDto.id,
      },
    });
  }

  async findById(id: string): Promise<Post> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async findMany(): Promise<Post[]> {
    return this.prisma.post.findMany();
  }
}
