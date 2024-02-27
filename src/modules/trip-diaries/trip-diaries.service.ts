import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTripDiaryDto } from './dtos/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dtos/update-trip-diary.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { TripDiaryClientEntity } from 'src/modules/trip-diaries/entities/trip-diary-client.entity';

@Injectable()
export class TripDiariesService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createTripDiaryDto: CreateTripDiaryDto,
    currentUser: UserFromJwt,
  ): Promise<TripDiaryEntity> {
    return this.prisma.tripDiary.create({
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
    });
  }

  findByUsername(username: string): Promise<TripDiaryClientEntity[]> {
    return this.prisma.tripDiary.findMany({
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
      },
    });
  }

  async findPostsById(
    id: number,
    currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.prisma.diaryPost.findMany({
      where: {
        tripDiaryId: id,
      },
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

    return posts.map((post) => {
      return {
        ...post,
        isLiked: post.likedBy.some((like) => like.userId === currentUser?.id),
        likedBy: post.likedBy.length,
      };
    });
  }

  async findOne(id: number): Promise<TripDiaryEntity> {
    const tripDiary = await this.prisma.tripDiary.findUnique({
      where: { id: id },
      include: {
        user: true,
      },
    });

    if (!tripDiary) {
      throw new NotFoundException();
    }

    return tripDiary;
  }

  update(
    id: number,
    updateTripDiaryDto: UpdateTripDiaryDto,
  ): Promise<TripDiaryEntity> {
    return this.prisma.tripDiary.update({
      data: updateTripDiaryDto,
      where: { id: id },
    });
  }

  remove(id: number): Promise<TripDiaryEntity> {
    return this.prisma.tripDiary.delete({ where: { id: id } });
  }
}
