import { Injectable } from '@nestjs/common';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.city.findMany();
  }

  findByCountry(countryIso2: string) {
    return this.prisma.city.findMany({
      where: {
        region: {
          country: {
            iso2: countryIso2,
          },
        },
      },
    });
  }

  async findById(id: number, currentUser: UserFromJwt) {
    const city = await this.prisma.city.findUnique({
      where: {
        id,
      },
      include: {
        region: {
          include: {
            country: true,
          },
        },
        cityInterests: true,
        cityVisits: true,
      },
    });

    return {
      ...city,
      isInterested: city?.cityInterests.some(
        (interest) => interest.userId === currentUser.id,
      ),
      isVisited: city?.cityVisits.some(
        (visit) => visit.userId === currentUser.id,
      ),
    };
  }

  async mostInterestedRanking(page: number, count: number) {
    const cities = await this.prisma.city.findMany({
      take: +count,
      skip: count * (page - 1),
      orderBy: {
        cityInterests: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        cityInterests: true,
        name: true,
        region: {
          include: {
            country: true,
          },
        },
      },
    });

    return cities.map((city) => {
      return {
        id: city.id,
        name: city.name,
        totalInterest: city.cityInterests.length,
        countryIso2: city.region.country.iso2,
        countryName: city.region.country.name,
      };
    });
  }
}
