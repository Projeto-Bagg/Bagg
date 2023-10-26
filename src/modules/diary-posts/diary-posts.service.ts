import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { MediaService } from 'src/modules/media/media.service';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { UsersService } from 'src/modules/users/users.service';
import { UserClient } from 'src/modules/users/entities/user-client.entity';

@Injectable()
export class DiaryPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly usersService: UsersService,
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

  async findById(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const diaryPost = await this.prisma.diaryPost.findUnique({
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

    if (!diaryPost) {
      throw new NotFoundException();
    }

    return {
      ...diaryPost,
      isLiked: diaryPost.likedBy.some(
        (like) => like.userId === currentUser?.id,
      ),
      likedBy: diaryPost.likedBy.length,
    };
  }

  async feedFollowedByCurrentUser(
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        user: {
          followers: {
            some: {
              followerId: currentUser?.id,
            },
          },
        },
      },
      include: {
        user: true,
        diaryPostMedias: true,
        likedBy: true,
        tripDiary: true,
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

  async feedLikedByUser(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        likedBy: {
          some: {
            user: {
              username,
            },
          },
        },
      },
      include: {
        user: true,
        diaryPostMedias: true,
        likedBy: true,
        tripDiary: true,
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

  async likedBy(id: number, currentUser?: UserFromJwt): Promise<UserClient[]> {
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
          ...(await this.usersService.friendshipCount(user.username)),
          ...(await this.usersService.friendshipStatus(
            user.username,
            currentUser,
          )),
        };
      }),
    );
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

  findMany() {
    return this.prisma.diaryPost.findMany();
  }
}
