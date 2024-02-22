import { Injectable, NotFoundException } from '@nestjs/common';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CitySearchDto } from 'src/modules/cities/dtos/city-search.dto';
import { CityClientEntity } from 'src/modules/cities/entities/city-client.entity';
import { CityInterestRankingEntity } from 'src/modules/cities/entities/city-interest-ranking.entity';
import { CityRatingRankingEntity } from 'src/modules/cities/entities/city-rating-ranikng.entity';
import { CityVisitRankingEntity } from 'src/modules/cities/entities/city-visit-ranking.entity';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cityInterestsService: CityInterestsService,
    private readonly cityVisitsService: CityVisitsService,
  ) {}

  findByCountry(countryIso2: string): Promise<CityEntity[]> {
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

  async findById(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<CityClientEntity> {
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
      },
    });

    if (!city) {
      throw new NotFoundException();
    }

    if (!currentUser) {
      return {
        ...city,
        isInterested: false,
        isVisited: false,
      };
    }

    const isInterested = await this.cityInterestsService.isUserInterestedInCity(
      city.id,
      currentUser.id,
    );

    const isVisited = await this.cityVisitsService.hasUserVisitedCity(
      city.id,
      currentUser.id,
    );

    return {
      ...city,
      isInterested,
      isVisited,
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
      ORDER BY totalInterest DESC, LEN(c.name) ASC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `) as CityEntity[];
  }

  async interestRanking(
    page: number,
    count: number,
  ): Promise<CityInterestRankingEntity[]> {
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
        cityInterests: {
          select: {
            id: true,
          },
        },
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

  async visitRanking(
    page: number,
    count: number,
  ): Promise<CityVisitRankingEntity[]> {
    const cities = await this.prisma.city.findMany({
      take: +count,
      skip: count * (page - 1),
      orderBy: {
        cityVisits: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        cityVisits: {
          select: {
            id: true,
          },
        },
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
  async ratingRanking(page: number, count: number) {
    return (await this.prisma.$queryRaw`
      SELECT ci.*, r.name AS region, c.iso2, c.name AS country, ROUND(AVG(CAST(cv.rating AS FLOAT)), 1) AS averageRating
      FROM [dbo].[City] ci
      JOIN [dbo].[Region] r ON ci.regionId = r.id
      JOIN [dbo].[Country] c ON c.id = r.countryId
      JOIN [dbo].[CityVisit] cv ON ci.id = cv.cityId
      GROUP BY ci.name, ci.latitude, ci.longitude, ci.id, ci.regionId, r.name, c.iso2, c.name
      ORDER BY averageRating DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `) as CityRatingRankingEntity[];
  }
}
