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
import { UsersService } from 'src/modules/users/users.service';
import { TipCommentsService } from 'src/modules/tip-comments/tip-comments.service';

@Injectable()
export class TipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
    private readonly usersService: UsersService,
    private readonly tipCommentsService: TipCommentsService,
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
      where: { id },
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

  async findByUserCityInterest(
    count = 10,
    page = 1,
    currentUser: UserFromJwt,
  ): Promise<TipEntity[]> {
    const cities = (
      await this.prisma.cityInterest.findMany({
        where: { userId: currentUser.id },
        select: { cityId: true },
      })
    ).map((city) => city.cityId);

    const index = count * (page - 1);

    const tips = await this.prisma.tip.findMany({
      skip: index,
      take: count,
      where: { cityId: { in: cities } },
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
          ...(await this.usersService.friendshipCount(user.username)),
          friendshipStatus: await this.usersService.friendshipStatus(
            user.username,
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

    if (tip.tipMedias && tip.tipMedias.length > 0) {
      tip.tipMedias.forEach(async (media) => {
        const fileName = media.url.split('/').pop();

        if (!fileName) {
          return;
        }

        await this.mediaService.deleteFile(fileName, 'tips');
      });
    }

    await this.prisma.tip.delete({
      where: {
        id,
      },
    });
  }
}
