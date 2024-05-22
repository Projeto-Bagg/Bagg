import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CityInterestEntity } from './entities/city-interest.entity';

@Injectable()
export class CityInterestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    cityId: number,
    currentUser: UserFromJwt,
  ): Promise<CityInterestEntity> {
    return this.prisma.cityInterest.create({
      data: {
        cityId,
        userId: currentUser.id,
      },
    });
  }

  async getInterestsCountByCityId(cityId: number): Promise<number> {
    return await this.prisma.cityInterest.count({
      where: {
        cityId,
      },
    });
  }

  async getCountryInterestsCountByIso2(iso2: string): Promise<number> {
    return await this.prisma.cityInterest.count({
      where: {
        city: {
          region: {
            country: {
              iso2,
            },
          },
        },
      },
    });
  }

  async isUserInterestedInCity(
    cityId: number,
    userId: number,
  ): Promise<boolean> {
    const cityInterest = await this.prisma.cityInterest.findUnique({
      where: {
        userId_cityId: {
          cityId,
          userId,
        },
      },
    });

    return !!cityInterest;
  }

  async remove(cityId: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.cityInterest.delete({
      where: {
        userId_cityId: {
          cityId,
          userId: currentUser.id,
        },
      },
    });
  }
}
