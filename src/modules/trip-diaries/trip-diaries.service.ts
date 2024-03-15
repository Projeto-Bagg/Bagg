import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTripDiaryDto } from './dtos/create-trip-diary.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { TripDiaryClientDto } from 'src/modules/trip-diaries/dtos/trip-diary-client.dto';

@Injectable()
export class TripDiariesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTripDiaryDto: CreateTripDiaryDto,
    currentUser: UserFromJwt,
  ): Promise<TripDiaryClientDto> {
    const tripDiary = await this.prisma.tripDiary.create({
      data: {
        message: createTripDiaryDto.message,
        title: createTripDiaryDto.title,
        city: {
          connect: {
            id: createTripDiaryDto.cityId,
          },
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        city: {
          include: {
            region: {
              include: {
                country: true,
              },
            },
          },
        },
        user: true,
      },
    });

    return {
      ...tripDiary,
      postsAmount: 0,
    };
  }

  async findByUsername(username: string): Promise<TripDiaryClientDto[]> {
    const tripDiaries = await this.prisma.tripDiary.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        city: {
          include: {
            region: {
              include: {
                country: true,
              },
            },
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return await Promise.all(
      tripDiaries.map(async (tripDiary) => {
        const postsAmount = await this.prisma.diaryPost.count({
          where: { tripDiaryId: tripDiary.id },
        });

        return {
          ...tripDiary,
          postsAmount,
        };
      }),
    );
  }

  async findPostsById(
    id: number,
    page = 1,
    count = 10,
    currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        tripDiaryId: id,
      },
      skip: count * (page - 1),
      take: count,
      include: {
        diaryPostMedias: true,
        likedBy: true,
        tripDiary: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return await Promise.all(
      posts.map(async (post) => {
        return {
          ...post,
          isLiked: post.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: post.likedBy.length,
        };
      }),
    );
  }

  async findOne(id: number): Promise<TripDiaryClientDto> {
    const tripDiary = await this.prisma.tripDiary.findUnique({
      where: { id: id },
      include: {
        user: true,
        city: {
          include: {
            region: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });

    if (!tripDiary) {
      throw new NotFoundException();
    }

    const postsAmount = await this.prisma.diaryPost.count({
      where: {
        tripDiaryId: id,
      },
    });

    return {
      ...tripDiary,
      postsAmount,
    };
  }

  async remove(id: number, currentUser: UserFromJwt): Promise<void> {
    const tripDiary = await this.prisma.tripDiary.findUnique({ where: { id } });

    if (!tripDiary) {
      throw new NotFoundException();
    }

    if (tripDiary.userId !== currentUser.id) {
      throw new UnauthorizedException();
    }

    await this.prisma.tripDiary.delete({ where: { id: id } });
  }
}
