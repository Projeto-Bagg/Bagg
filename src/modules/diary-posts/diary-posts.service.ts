import { Injectable } from '@nestjs/common';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { MediaService } from 'src/modules/media/media.service';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';

@Injectable()
export class DiaryPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    createDiaryPostDto: CreateDiaryPostDto,
    medias: Express.Multer.File[],
    currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const diaryPost = await this.prisma.diaryPost.create({
      data: {
        title: createDiaryPostDto.title,
        message: createDiaryPostDto.message,
        tripDiary: {
          connect: {
            id: Number(createDiaryPostDto.tripDiaryId),
          },
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        user: true,
        tripDiary: true,
      },
    });

    const diaryPostMedias = await Promise.all(
      medias.map(async (media) => {
        const url = await this.mediaService.uploadFile(media, 'diary-posts');
        return await this.prisma.diaryPostMedia.create({
          data: {
            url,
            diaryPost: {
              connect: {
                id: diaryPost.id,
              },
            },
          },
        });
      }),
    );

    return { ...diaryPost, diaryPostMedias, isLiked: false, likedBy: 0 };
  }

  async like(id: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.diaryPostLike.create({
      data: {
        diaryPost: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
  }

  async unlike(id: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.diaryPostLike.delete({
      where: {
        userId_diaryPostId: {
          diaryPostId: id,
          userId: currentUser.id,
        },
      },
    });
  }

  async findByUsername(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        user: true,
        diaryPostMedias: true,
        tripDiary: true,
        likedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => {
      return {
        ...post,
        isLiked: post.likedBy.some((like) => like.userId === currentUser.id),
        likedBy: post.likedBy.length,
      };
    });
  }

  findMany() {
    return this.prisma.diaryPost.findMany();
  }
}
