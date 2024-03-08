import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { UpdateTipDto } from './dtos/update-tip.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { TipEntity } from 'src/modules/tips/entities/tip.entity';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { MediaService } from '../media/media.service';
import { TipMedia } from '@prisma/client';

@Injectable()
export class TipsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
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
      tipMedias,
    };
  }

  findMany(): Promise<TipEntity[]> {
    return this.prisma.tip.findMany({
      include: {
        user: true,
        tipMedias: true,
      },
    });
  }

  async findUnique(id: number): Promise<TipEntity> {
    const tip = await this.prisma.tip.findUnique({
      where: { id },
      include: {
        user: true,
        tipMedias: true,
      },
    });

    if (!tip) {
      throw new NotFoundException();
    }

    return tip;
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

    return await this.prisma.tip.findMany({
      skip: index,
      take: count,
      where: { cityId: { in: cities } },
      include: {
        user: true,
        tipMedias: true,
      },
    });
  }

  // update(id: number, UpdateTipDto: UpdateTipDto): Promise<TipEntity> {
  //   return this.prisma.tip.update({
  //     where: { id },
  //     data: UpdateTipDto,
  //     include: {
  //       user: true,
  //     },
  //   });
  // }

  async delete(id: number): Promise<boolean> {
    return !!(await this.prisma.tip.delete({ where: { id } }));
  }
}
