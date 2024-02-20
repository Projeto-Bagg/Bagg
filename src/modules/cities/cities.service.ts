import { Injectable, NotFoundException } from '@nestjs/common';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CitySearchDto } from 'src/modules/cities/entities/city-search.dto';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
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

    if (!city) {
      throw new NotFoundException();
    }

    return {
      ...city,
      isInterested:
        currentUser &&
        city.cityInterests.some(
          (interest) => interest.userId === currentUser.id,
        ),
      isVisited:
        currentUser &&
        city.cityVisits.some((visit) => visit.userId === currentUser.id),
    };
  }

  async search(query: CitySearchDto): Promise<CityEntity[]> {
    return (await this.prisma.$queryRaw`
      DECLARE @page INT = ${query.page || 1};
      DECLARE @count INT = ${query.count};

      SELECT
          c.*,
          co.iso2,
          r.name as region,
          co.name as country,
          (SELECT COUNT(*) FROM [dbo].[CityInterest] WHERE cityId = c.id) AS totalInterest
      FROM 
          [dbo].[City] c
      JOIN 
          [dbo].[Region] r ON c.regionId = r.id
      JOIN 
          [dbo].[Country] co ON r.countryId = co.id
      WHERE CONTAINS(c.name, ${'"' + query.q + '*"'})
      ORDER BY totalInterest DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `) as CityEntity[];
  }

  async interestRanking(page: number, count: number) {
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
        region: city.region,
      };
    });
  }

  async visitRanking(page: number, count: number) {
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
        cityVisits: true,
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
        totalVisit: city.cityVisits.length,
        region: city.region,
      };
    });
  }
}
