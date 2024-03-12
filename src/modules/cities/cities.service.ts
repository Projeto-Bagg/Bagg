import { Injectable, NotFoundException } from '@nestjs/common';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CitySearchDto } from 'src/modules/cities/dtos/city-search.dto';
import { CityInterestRankingDto } from 'src/modules/cities/dtos/city-interest-ranking.dto';
import { CityRatingRankingDto } from 'src/modules/cities/dtos/city-rating-ranking.dto';
import { CityVisitRankingDto } from 'src/modules/cities/dtos/city-visit-ranking.dto';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { CityNearDto } from 'src/modules/cities/dtos/city-near.dto';
import { CitySearchResponseDto } from 'src/modules/cities/dtos/city-search-response';
import { CityPageDto } from 'src/modules/cities/dtos/city-page.dto';

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

  async findById(id: number, currentUser?: UserFromJwt): Promise<CityPageDto> {
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

    const images = await this.prisma.$queryRaw<MediaEntity[]>`
      DECLARE @cityId INT = ${city.id}
      (SELECT m.id, m.url, m.createdAt FROM [dbo].[DiaryPostMedia] m
      JOIN [dbo].[DiaryPost] dp ON dp.id = m.diaryPostId
      JOIN [dbo].[TripDiary] td ON td.id = dp.tripDiaryId
      WHERE td.cityId = @cityId)
      UNION ALL
      (SELECT m.id, m.url, m.createdAt FROM [dbo].[TipMedia] m
      JOIN [dbo].[Tip] t ON t.id = m.tipId
      WHERE t.cityId = @cityId)
      ORDER BY createdAt DESC
      OFFSET 0 ROWS
      FETCH FIRST 10 ROWS ONLY;
    `;

    const averageRating = await this.cityVisitsService.getAverageRatingByCityId(
      city.id,
    );

    const visitsCount = await this.cityVisitsService.getVisitsCountByCityId(
      city.id,
    );

    const interestsCount =
      await this.cityInterestsService.getInterestsCountByCityId(city.id);

    if (!currentUser) {
      return {
        ...city,
        isInterested: false,
        images,
        userVisit: null,
        visits: [],
        averageRating,
        visitsCount,
        interestsCount,
      };
    }

    const isInterested = await this.cityInterestsService.isUserInterestedInCity(
      city.id,
      currentUser.id,
    );

    const userVisit = await this.cityVisitsService.getUserVisitByCityId(
      city.id,
      currentUser.id,
    );

    const visits = await this.cityVisitsService.getVisitsByCityId(
      city.id,
      1,
      5,
    );

    return {
      ...city,
      isInterested,
      userVisit,
      visits,
      averageRating,
      visitsCount,
      interestsCount,
      images,
    };
  }

  async getNearCities(
    cityId: number,
    page: number,
    count: number,
  ): Promise<CityNearDto[]> {
    const city = await this.prisma.city.findUnique({
      where: {
        id: +cityId,
      },
    });

    if (!city) {
      throw new NotFoundException();
    }

    return await this.prisma.$queryRaw<CityNearDto[]>`
      DECLARE @page INT = ${page || 1};
      DECLARE @count INT = ${count};
      DECLARE @searchLatitude FLOAT = ${city.latitude};
      DECLARE @searchLongitude FLOAT = ${city.longitude};

      SELECT name, distance, averageRating
      FROM (
          SELECT name, ROUND(AVG(CAST(cv.rating AS FLOAT)), 1) AS averageRating, ( 6371 * acos( cos( radians(@searchLatitude) ) * cos( radians( c.latitude ) ) 
              * cos( radians( c.longitude ) - radians(@searchLongitude) ) + sin( radians(@searchLatitude) ) * sin(radians(c.latitude)) ) ) AS distance 
          FROM [dbo].[City] c
          LEFT JOIN [dbo].[CityVisit] cv ON c.id = cv.cityId
          WHERE latitude != @searchLatitude AND longitude != @searchLongitude
          GROUP BY c.name, c.latitude, longitude
      ) AS sub
      ORDER BY distance
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async search(query: CitySearchDto): Promise<CitySearchResponseDto[]> {
    return await this.prisma.$queryRaw<CitySearchResponseDto[]>`
      DECLARE @page INT = ${query.page || 1};
      DECLARE @count INT = ${query.count || 5};

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
    `;
  }

  async interestRanking(
    page = 1,
    count = 10,
  ): Promise<CityInterestRankingDto[]> {
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

  async visitRanking(page = 1, count = 10): Promise<CityVisitRankingDto[]> {
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

  async ratingRanking(page = 1, count = 10) {
    return await this.prisma.$queryRaw<CityRatingRankingDto[]>`
      SELECT ci.*, r.name AS region, c.iso2, c.name AS country, ROUND(AVG(CAST(cv.rating AS FLOAT)), 1) AS averageRating
      FROM [dbo].[City] ci
      JOIN [dbo].[Region] r ON ci.regionId = r.id
      JOIN [dbo].[Country] c ON c.id = r.countryId
      JOIN [dbo].[CityVisit] cv ON ci.id = cv.cityId
      GROUP BY ci.name, ci.latitude, ci.longitude, ci.id, ci.regionId, r.name, c.iso2, c.name
      ORDER BY averageRating DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `;
  }
}
