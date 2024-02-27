import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityVisitDto } from './dtos/create-city-visit.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

@Injectable()
export class CityVisitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cityInterestService: CityInterestsService,
  ) {}

  async create(
    createCityVisitDto: CreateCityVisitDto,
    currentUser: UserFromJwt,
  ): Promise<CityVisitEntity> {
    const isUserInterestedInCity =
      await this.cityInterestService.isUserInterestedInCity(
        createCityVisitDto.cityId,
        currentUser.id,
      );

    if (isUserInterestedInCity) {
      await this.cityInterestService.remove(
        createCityVisitDto.cityId,
        currentUser,
      );
    }

    return this.prisma.cityVisit.create({
      data: {
        ...createCityVisitDto,
        userId: currentUser.id,
      },
    });
  }

  async hasUserVisitedCity(cityId: number, userId: number): Promise<boolean> {
    const visitVisit = await this.prisma.cityVisit.findUnique({
      where: {
        userId_cityId: {
          cityId,
          userId,
        },
      },
    });

    return !!visitVisit;
  }

  async getVisitsByCityId(
    cityId: number,
    page: number,
    count: number,
  ): Promise<CityVisitEntity[]> {
    const visits = await this.prisma.cityVisit.findMany({
      take: count,
      skip: (page - 1) * count,
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        cityId,
      },
      include: {
        user: true,
      },
    });

    return visits;
  }

  remove(cityId: number, currentUser: UserFromJwt): Promise<CityVisitEntity> {
    return this.prisma.cityVisit.delete({
      where: {
        userId_cityId: {
          cityId,
          userId: currentUser.id,
        },
      },
    });
  }
}
