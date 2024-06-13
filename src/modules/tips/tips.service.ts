import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { PrismaService } from '../../prisma/prisma.service';
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
import { CreateTipReportDto } from 'src/modules/tips/dtos/create-tip-report.dto';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CitiesService } from '../cities/cities.service';
import { TipClientDto } from 'src/modules/tips/dtos/tip-client.dto';

interface TipWithCommentsAndLikes extends Tip {
  likedBy: TipLike[];
  tipComments: TipComment[];
}

interface TipWithCreatedDateAtAsDate extends Tip {
  createdAtAsDate: string;
}

interface NotFormatedTip extends Tip {
  city: CityRegionCountryDto;
  tipMedias: TipMediaEntity[];
  user: UserEntity;
  likedBy: TipLike[];
}

interface TipSortedByRelevancy extends NotFormatedTip {
  createdAtAsDate: string;
}

@Injectable()
export class TipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly tipCommentsService: TipCommentsService,
    private readonly followsService: FollowsService,
    private readonly tipWordsService: TipWordsService,
    private readonly citiesService: CitiesService,
    private readonly cityInterestsService: CityInterestsService,
  ) {}

  async create(
    createTipDto: CreateTipDto,
    medias: Express.Multer.File[],
    currentUser: UserFromJwt,
  ): Promise<TipClientDto> {
    const tip = await this.prisma.tip.create({
      data: {
        ...createTipDto,
        tags: createTipDto.tags?.toLowerCase(),
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
      likedBy: [],
      likesAmount: 0,
      commentsAmount: 0,
      tipMedias,
    };
  }

  async findUnique(
    id: number,
    currentUser: UserFromJwt,
  ): Promise<TipClientDto> {
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

    return this.formatTipClient(tip, currentUser);
  }

  async findByUsername(
    username: string,
    page = 1,
    count = 10,
    currentUser?: UserFromJwt,
  ): Promise<TipClientDto[]> {
    const tips = await this.prisma.tip.findMany({
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
      tips.map(async (tip) => this.formatTipClient(tip, currentUser)),
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
  ): Promise<void> {
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
      where: { AND: [{ tipId: id }, { reviewed: false }] },
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
  ): Promise<TipClientDto[]> {
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
          {
            softDelete: false,
          },
          { status: 'active' },
        ],
      },
      include: {
        tipWord: { select: { word: true } },
      },
      take: wordCount,
    });

    const wordFrequency = new Map<string, number>();

    const words = tips.flatMap((tip) =>
      tip.tipWord.map((word) => word.word.toLowerCase()),
    );

    words.forEach((word) => {
      const currentFrequency = wordFrequency.get(word) || 0;
      wordFrequency.set(word, currentFrequency + 1);
    });

    const uniqueWords = Array.from(new Set(words))
      .sort((a, b) => {
        const freqA = wordFrequency.get(a) || 0;
        const freqB = wordFrequency.get(b) || 0;
        return freqB - freqA;
      })
      .slice(0, 10);

    const idsToIgnore = tips.map((tip) => tip.id);

    const relevantTips = await this.prisma.tip.findMany({
      where: {
        AND: [
          { tipWord: { some: { word: { in: uniqueWords } } } },
          { id: { notIn: idsToIgnore } },
          { createdAt: { lte: new Date(), gte: tipStartDate } },
          { softDelete: false },
          { status: 'active' },
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
      orderBy: {
        createdAt: 'desc',
      },
      take: count,
      skip: count * (page - 1),
    });

    return await Promise.all(
      relevantTips.map(async (tip) => this.formatTipClient(tip, currentUser)),
    );
  }

  async getTipsFromRecommendedCities(
    currentUser: UserFromJwt,
    page = 1,
    count = 10,
    idsToIgnore?: number[],
  ): Promise<TipClientDto[]> {
    const ids = (
      await this.citiesService.recommendCities(currentUser, 1, 20)
    ).map((cityRecommendation) => cityRecommendation.id);

    const tips = await this.prisma.tip.findMany({
      where: {
        AND: [
          {
            AND: [
              { cityId: { in: ids } },
              { id: { notIn: idsToIgnore } },
              {
                NOT: { userId: currentUser.id },
              },
            ],
          },
          { status: 'active' },
          { softDelete: false },
        ],
      },
      orderBy: {
        createdAt: 'desc',
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
      tips.map(async (tip) => this.formatTipClient(tip, currentUser)),
    );
  }

  async getRecommendationFeed(
    currentUser: UserFromJwt,
    wordCount?: number,
    //serve pra ver a data das palavras curtidas/usadas
    startDate?: Date,
    endDate?: Date,
    //serve pra puxar as tips relevantes
    tipStartDate?: Date,
    page = 1,
    count = 10,
  ): Promise<TipClientDto[]> {
    const relevantTips = await this.getRelevantTips(
      currentUser,
      wordCount,
      startDate,
      endDate,
      tipStartDate,
      page,
      count / 2,
    );

    const relevantTipsIds = relevantTips.map((tips) => tips.id);

    const recommendCities = await this.getTipsFromRecommendedCities(
      currentUser,
      page,
      count / 2,
      relevantTipsIds,
    );

    return relevantTips.concat(recommendCities).sort(() => Math.random() - 0.5);
  }

  async getTipsFeed(
    page = 1,
    count = 10,
    filter: FeedFilterDto,
    currentUser: UserFromJwt,
  ): Promise<TipClientDto[]> {
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
        NOT: {
          userId: currentUser.id,
        },
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
            NOT: {
              userId: currentUser.id,
            },
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
        (page - 1) * count * 0.6,
        (page - 1) * count + count * 0.6,
      ),
    );

    return await Promise.all(
      tips.map(async (tip) => this.formatTipClient(tip, currentUser)),
    );
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
  ): Promise<TipClientDto[]> {
    const tagsAsQueries =
      tags?.map((tag) => ({
        tags: { contains: tag },
      })) ?? [];

    const wordsInQuery = q
      ?.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ');

    const tips = await this.prisma.tip.findMany({
      where: {
        AND: [
          {
            AND: wordsInQuery?.map((word) => {
              return {
                message: { contains: word },
              };
            }),
          },
          {
            OR: [...tagsAsQueries],
          },
          {
            cityId: city,
          },
          {
            status: 'active',
          },
          {
            softDelete: false,
          },
        ],
      },
      skip: count * (page - 1),
      take: count,
      orderBy: {
        createdAt: 'desc',
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
    });

    return await Promise.all(
      tips.map(async (tip) => this.formatTipClient(tip, currentUser)),
    );
  }

  async formatTipClient(tip: NotFormatedTip, currentUser?: UserFromJwt) {
    const commentsAmount = await this.tipCommentsService.getTipCommentsAmount(
      tip.id,
    );

    return {
      ...tip,
      isLiked: tip.likedBy.some((like) => like.userId === currentUser?.id),
      likesAmount: tip.likedBy.length,
      commentsAmount,
    };
  }
}
