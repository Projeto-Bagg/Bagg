import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDiaryPostDto } from './dtos/create-diary-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { MediaService } from 'src/modules/media/media.service';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { FollowsService } from 'src/modules/follows/follows.service';

@Injectable()
export class DiaryPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly followsService: FollowsService,
  ) {}

  async create(
    createDiaryPostDto: CreateDiaryPostDto,
    medias: Express.Multer.File[],
    currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const diaryPost = await this.prisma.diaryPost.create({
      data: {
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

    return {
      ...diaryPost,
      diaryPostMedias,
      isLiked: false,
      likedBy: 0,
    };
  }

  async findById(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const post = await this.prisma.diaryPost.findUnique({
      where: {
        id,
      },
      include: {
        diaryPostMedias: true,
        likedBy: true,
        tripDiary: true,
        user: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return {
      ...post,
      isLiked: post.likedBy.some((like) => like.userId === currentUser?.id),
      likedBy: post.likedBy.length,
    };
  }

  async likedBy(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        diaryPostLikes: {
          some: {
            diaryPostId: id,
          },
        },
      },
    });

    return await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          friendshipStatus: await this.followsService.friendshipStatus(
            user.id,
            currentUser,
          ),
        };
      }),
    );
  }

  async findByUsername(
    username: string,
    page = 1,
    count = 10,
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        user: {
          username,
        },
      },
      skip: count * (page - 1),
      take: count,
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
        isLiked: post.likedBy.some((like) => like.userId === currentUser?.id),
        likedBy: post.likedBy.length,
      };
    });
  }

  async delete(id: number, currentUser: UserFromJwt): Promise<void> {
    const post = await this.prisma.diaryPost.findUnique({
      where: {
        id,
      },
      include: {
        diaryPostMedias: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.userId !== currentUser.id) {
      throw new UnauthorizedException();
    }

    if (post.diaryPostMedias && post.diaryPostMedias.length > 0) {
      post.diaryPostMedias.forEach(async (media) => {
        const fileName = media.url.split('/').pop();

        if (!fileName) {
          return;
        }

        await this.mediaService.deleteFile(fileName, 'diary-posts');
      });
    }

    await this.prisma.diaryPost.delete({
      where: {
        id,
      },
    });
  }
}
