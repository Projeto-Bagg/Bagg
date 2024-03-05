import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CityInterestEntity } from 'src/modules/city-interests/entities/city-interest.entity';

@Injectable()
export class CityInterestsService {
  constructor(private readonly prisma: PrismaService) { }

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

  remove(cityId: number, currentUser: UserFromJwt) {
    return this.prisma.cityInterest.delete({
      where: {
        userId_cityId: {
          cityId,
          userId: currentUser.id,
        },
      },
    });
  }

  findMany() {
    return this.prisma.cityInterest.findMany();
  }
}
