import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { TipEntity } from 'src/modules/tips/entities/tip.entity';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { MediaService } from '../media/media.service';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { TipCommentsService } from 'src/modules/tip-comments/tip-comments.service';
import { FollowsService } from 'src/modules/follows/follows.service';
import { TipWordsService } from '../tip-words/tip-words.service';
import { FeedFilterDto } from '../tip-words/dtos/feed-filter.dto';
import { Tip, TipComment, TipLike } from '@prisma/client';
import { TipMediaEntity } from '../tip-medias/entities/tip-media.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CityRegionCountryDto } from '../cities/dtos/city-region-country.dto';
import { DistanceService } from '../distance/distance.service';
import { CreateTipReportDto } from 'src/modules/tips/dtos/create-tip-report.dto';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { ids } from 'googleapis/build/src/apis/ids';

interface TipWithCommentsAndLikes extends Tip {
  likedBy: TipLike[];
  tipComments: TipComment[];
}

interface TipWithCreatedDateAtAsDate extends Tip {
  createdAtAsDate: string;
}

interface TipSortedByRelevancy extends Tip {
  createdAtAsDate: string;
  city: CityRegionCountryDto;
  tipMedias: TipMediaEntity[];
  user: UserEntity;
  likedBy: TipLike[];
  tipComments: TipComment[];
}

@Injectable()
export class TipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly tipCommentsService: TipCommentsService,
    private readonly followsService: FollowsService,
    private readonly tipWordsService: TipWordsService,
    private readonly distanceService: DistanceService,
    private readonly cityInterestsService: CityInterestsService,
  ) {}

  async create(
    createTipDto: CreateTipDto,
    medias: Express.Multer.File[],
    currentUser: UserFromJwt,
  ): Promise<TipEntity> {
    const tip = await this.prisma.tip.create({
      data: {
        ...createTipDto,
        userId: currentUser.id,
      },
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

    const tipMedias = await Promise.all(
      medias.map(async (media) => {
        const url = await this.mediaService.uploadFile(media, 'tips');
        return await this.prisma.tipMedia.create({
          data: {
            url,
            tip: {
              connect: {
                id: tip.id,
              },
            },
          },
        });
      }),
    );

    this.tipWordsService.indexTipWords(tip);

    return {
      ...tip,
      isLiked: false,
      likedBy: 0,
      commentsAmount: 0,
      tipMedias,
    };
  }

  async findUnique(id: number, currentUser: UserFromJwt): Promise<TipEntity> {
    const tip = await this.prisma.tip.findUnique({
      where: { id, softDelete: false, status: 'active' },
      include: {
        user: true,
        tipMedias: true,
        likedBy: true,
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

    if (!tip) {
      throw new NotFoundException();
    }

    const commentsAmount = await this.tipCommentsService.getTipCommentsAmount(
      tip.id,
    );

    return {
      ...tip,
      isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
      likedBy: tip.likedBy.length,
      commentsAmount,
    };
  }

  async findByUsername(
    username: string,
    page = 1,
    count = 10,
    currentUser?: UserFromJwt,
  ): Promise<TipEntity[]> {
    const posts = await this.prisma.tip.findMany({
      where: {
        user: {
          username,
        },
        softDelete: false,
        status: 'active',
      },
      skip: count * (page - 1),
      take: count,
      include: {
        user: true,
        tipMedias: true,
        likedBy: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return await Promise.all(
      posts.map(async (post) => {
        const commentsAmount =
          await this.tipCommentsService.getTipCommentsAmount(post.id);

        return {
          ...post,
          isLiked: post.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: post.likedBy.length,
          commentsAmount,
        };
      }),
    );
  }

  async getTipsFeed(
    page = 1,
    count = 10,
    filter: FeedFilterDto,
    currentUser?: UserFromJwt,
  ): Promise<TipEntity[]> {
    const include = {
      user: true,
      tipMedias: true,
      likedBy: true,
      city: {
        include: {
          region: {
            include: {
              country: true,
            },
          },
        },
      },
    };

    const tipsByCityInterest = await this.prisma.tip.findMany({
      where: {
        ...(filter.cityInterest && {
          city: { cityInterests: { some: { userId: currentUser?.id } } },
        }),
        softDelete: false,
        status: 'active',
      },
      include,
      orderBy: {
        createdAt: 'desc',
      },
    });

    let tipsSortedByRelevancy: TipSortedByRelevancy[] = [];
    if (filter.relevancy) {
      //separa por dia e filtra por relevancia no dia
      const tipsWithCreatedAtAsDate: TipWithCreatedDateAtAsDate[] =
        tipsByCityInterest.map((tip) => ({
          ...tip,
          createdAtAsDate: tip.createdAt.toDateString(),
        }));

      const tipsSeparatedByDate: Tip[][] =
        this.separateArrayByProperty<TipWithCreatedDateAtAsDate>(
          tipsWithCreatedAtAsDate as TipWithCreatedDateAtAsDate[],
          'createdAt',
        );

      tipsSortedByRelevancy = tipsSeparatedByDate.flatMap((tips: Tip[]) =>
        tips.sort(
          (a, b) =>
            this.calculateRelevancy(a as TipWithCommentsAndLikes) -
            this.calculateRelevancy(b as TipWithCommentsAndLikes),
        ),
      ) as TipSortedByRelevancy[];
    }

    const tipsByFollows = filter.follows
      ? await this.prisma.tip.findMany({
          where: {
            id: { notIn: tipsSortedByRelevancy.map((tip) => tip.id) },
            user: {
              followers: { some: { followerId: currentUser?.id } },
            },
            softDelete: false,
            status: 'active',
          },
          orderBy: {
            createdAt: 'desc',
          },
          include,
          skip: count * (page - 1),
          take: count * 0.4,
        })
      : [];

    const tips = tipsByFollows.concat(
      (tipsSortedByRelevancy as TipSortedByRelevancy[]).slice(
        (page - 1) * count * 0.7,
        (page - 1) * count + count * 0.7,
      ),
    );

    return await Promise.all(
      tips.map(async (tip) => {
        const commentsAmount =
          await this.tipCommentsService.getTipCommentsAmount(tip.id);

        return {
          ...tip,
          isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: tip.likedBy.length,
          commentsAmount,
        };
      }),
    );
  }

  async likedBy(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        tipLikes: {
          some: {
            tipId: id,
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

  async delete(id: number, currentUser: UserFromJwt): Promise<void> {
    const tip = await this.prisma.tip.findUnique({
      where: {
        id,
      },
      include: {
        tipMedias: true,
      },
    });

    if (!tip) {
      throw new NotFoundException();
    }

    if (tip.userId !== currentUser.id) {
      throw new UnauthorizedException();
    }

    // if (tip.tipMedias && tip.tipMedias.length > 0) {
    //   tip.tipMedias.forEach(async (media) => {
    //     const fileName = media.url.split('/').pop();

    //     if (!fileName) {
    //       return;
    //     }

    //     await this.mediaService.deleteFile(fileName, 'tips');
    //   });
    // }

    await this.prisma.tip.update({
      data: {
        softDelete: true,
      },
      where: {
        id,
      },
    });
  }

  async report(
    id: number,
    createTipReportDto: CreateTipReportDto,
    currentUser: UserFromJwt,
  ) {
    await this.prisma.tipReport.create({
      data: {
        reason: createTipReportDto.reason,
        tip: {
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

    const minReportsLength = 7;

    const reportsLength = await this.prisma.tipReport.count({
      where: { tipId: id },
    });

    if (reportsLength <= minReportsLength) {
      return;
    }

    const tip = await this.prisma.tip.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            followers: true,
          },
        },
        likedBy: true,
      },
    });

    if (!tip) {
      return;
    }

    const interestAmountInCity =
      await this.cityInterestsService.getInterestsCountByCityId(tip.cityId);

    const commentsAmount = await this.tipCommentsService.getTipCommentsAmount(
      tip.id,
    );

    const interactions =
      tip.likedBy.length +
      tip.user.followers.length +
      interestAmountInCity * 0.3 +
      commentsAmount;

    if (
      Math.ceil(
        (Math.log2(interactions) / 100) * 0.1 * interactions + minReportsLength,
      ) >= reportsLength
    ) {
      await this.prisma.tip.update({
        where: { id },
        data: {
          status: 'in-review',
        },
      });
    }
  }

  async getRelevantTips(
    currentUser: UserFromJwt,
    wordCount?: number,
    //serve pra ver a data das palavras curtidas/usadas
    startDate?: Date,
    endDate?: Date,
    //serve pra puxar as tips relevantes
    tipStartDate?: Date,
    page = 1,
    count = 10,
  ) {
    const tips = await this.prisma.tip.findMany({
      where: {
        AND: [
          {
            OR: [
              { likedBy: { some: { userId: currentUser.id } } },
              { userId: currentUser.id },
            ],
          },
          {
            AND: [
              { createdAt: { gte: startDate } },
              { createdAt: { lte: endDate } },
            ],
          },
        ],
      },
      include: { tipWord: true },
      take: wordCount,
    });

    const idsToIgnore = tips.map((tip) => tip.id);
    const relevantWords = Array.from(
      new Set(
        tips.flatMap((tip) => tip.tipWord.map((tipWord) => tipWord.word)),
      ),
    );

    const relevantTips = await this.prisma.tip.findMany({
      where: {
        AND: [
          { tipWord: { some: { word: { in: relevantWords } } } },
          { id: { notIn: idsToIgnore } },
          { createdAt: { lte: new Date(), gte: tipStartDate } },
        ],
      },
      include: {
        user: true,
        tipMedias: true,
        likedBy: true,
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
      take: count,
      skip: count * (page - 1),
    });

    return await Promise.all(
      relevantTips.map(async (tip) => {
        const commentsAmount =
          await this.tipCommentsService.getTipCommentsAmount(tip.id);

        return {
          ...tip,
          isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: tip.likedBy.length,
          commentsAmount,
        };
      }),
    );
  }

  async recommendNearbyCitiesByUserCityInterests(
    currentUser: UserFromJwt,
    page = 1,
    count = 10,
  ) {
    const cities = (
      await this.prisma.user.findUnique({
        where: { id: currentUser.id },
        include: { cityInterests: { include: { city: true } } },
      })
    )?.cityInterests.map((cityInterest) => cityInterest.city);

    const closestCitiesToInterestedCities = (
      await Promise.all(
        Array.from(
          new Set(
            cities?.map(
              async (city) =>
                await this.distanceService.getClosestCities(city.id, 1, 5),
            ),
          ),
        ),
      )
    ).flat();

    return closestCitiesToInterestedCities
      .slice((page - 1) * count, (page - 1) * count + count)
      .sort(() => Math.random() - 0.5);
  }

  async getTipsFromRecommendedCities(
    currentUser: UserFromJwt,
    page = 1,
    count = 10,
  ) {
    const ids = (
      await this.recommendNearbyCitiesByUserCityInterests(currentUser, 1, 5)
    ).map((nearbyCityFromInterest) => nearbyCityFromInterest.id);
    const tips = await this.prisma.tip.findMany({
      where: { id: { in: ids } },
      include: {
        user: true,
        tipMedias: true,
        likedBy: true,
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
      take: count,
      skip: count * (page - 1),
    });
    return await Promise.all(
      tips.map(async (tip) => {
        const commentsAmount =
          await this.tipCommentsService.getTipCommentsAmount(tip.id);

        return {
          ...tip,
          isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: tip.likedBy.length,
          commentsAmount,
        };
      }),
    );
  }

  private async calculateTipRelevancy(
    tipId: number,
    startDate: Date,
    endDate: Date,
  ) {
    const tip = await this.prisma.tip.findUnique({
      where: { id: tipId, softDelete: false, status: 'active' },
      include: {
        tipComments: { where: { createdAt: { gte: startDate, lte: endDate } } },
        likedBy: { where: { createdAt: { gte: startDate, lte: endDate } } },
      },
    });

    const relevancy =
      tip && tip.likedBy.length * 0.3 * (tip.tipComments.length * 0.7);
    return relevancy ?? 0;
  }

  private calculateRelevancy(tip: TipWithCommentsAndLikes) {
    const relevancy =
      tip && tip.likedBy.length * 0.3 * ((tip.tipComments?.length ?? 0) * 0.7);
    return relevancy ?? 0;
  }

  private separateArrayByProperty<T>(arr: T[], property: keyof T): T[][] {
    const result: T[][] = [];
    arr.forEach((obj) => {
      const key = obj[property];
      const index = result.findIndex(
        (subArr) => subArr.length > 0 && subArr[0][property] === key,
      );
      if (index === -1) {
        result.push([obj]);
      } else {
        result[index].push(obj);
      }
    });
    return result;
  }
  async searchTips(
    currentUser?: UserFromJwt,
    q?: string,
    tags?: string[],
    city?: number,
    page = 1,
    count = 10,
  ) {
    const tagsAsQueries =
      tags?.map((tag) => ({
        tags: { contains: tag },
      })) ?? [];

    //n sei se funciona
    const tips = await this.prisma.tip.findMany({
      where: {
        AND: [
          { message: { contains: q } },
          {
            OR: [...tagsAsQueries],
          },
          {
            cityId: city,
          },
        ],
      },
      skip: count * (page - 1),
      take: count,
      include: {
        user: true,
        tipMedias: true,
        likedBy: true,
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

    return await Promise.all(
      tips.map(async (tip) => {
        const commentsAmount =
          await this.tipCommentsService.getTipCommentsAmount(tip.id);

        return {
          ...tip,
          isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
          likedBy: tip.likedBy.length,
          commentsAmount,
        };
      }),
    );
  }
}
