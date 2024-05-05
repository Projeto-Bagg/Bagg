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
import { CityPagination } from 'src/modules/cities/dtos/city-pagination.dto';
import { CitySearchResponseDto } from 'src/modules/cities/dtos/city-search-response';
import { CityPageDto } from 'src/modules/cities/dtos/city-page.dto';
import { UsersService } from 'src/modules/users/users.service';
import { CityImageDto } from 'src/modules/cities/dtos/city-image.dto';
import { CityRankingDto } from 'src/modules/cities/dtos/city-ranking.dto';

@Injectable()
export class CitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cityInterestsService: CityInterestsService,
    private readonly cityVisitsService: CityVisitsService,
    private readonly usersService: UsersService,
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

    const averageRating = await this.cityVisitsService.getAverageRatingByCityId(
      city.id,
    );

    const visitsCount = await this.cityVisitsService.getVisitsCountByCityId(
      city.id,
    );

    const reviewsCount = await this.cityVisitsService.getReviewsCountByCityId(
      city.id,
    );

    const interestsCount =
      await this.cityInterestsService.getInterestsCountByCityId(city.id);

    const residentsCount = await this.usersService.getResidentsCountByCityId(
      city.id,
    );

    const isInterested = currentUser
      ? await this.cityInterestsService.isUserInterestedInCity(
          city.id,
          currentUser.id,
        )
      : false;

    const userVisit = currentUser
      ? await this.cityVisitsService.getUserVisitByCityId(
          city.id,
          currentUser.id,
        )
      : null;

    return {
      ...city,
      isInterested,
      userVisit,
      averageRating,
      visitsCount,
      interestsCount,
      reviewsCount,
      residentsCount,
    };
  }

  async getCityImages(
    cityId: number,
    page = 1,
    count = 10,
  ): Promise<CityImageDto[]> {
    const images = await this.prisma.$queryRaw<
      (MediaEntity & { userId: number })[]
    >`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};
      DECLARE @cityId INT = ${cityId}

      (SELECT m.id, m.url, m.createdAt, td.userId
      FROM [dbo].[DiaryPostMedia] m
      JOIN [dbo].[DiaryPost] dp ON dp.id = m.diaryPostId
      JOIN [dbo].[TripDiary] td ON td.id = dp.tripDiaryId
      WHERE td.cityId = @cityId AND softDelete = 0 AND status = 'active')
      UNION ALL
      (SELECT m.id, m.url, m.createdAt, t.userId
      FROM [dbo].[TipMedia] m
      JOIN [dbo].[Tip] t ON t.id = m.tipId
      WHERE t.cityId = @cityId AND softDelete = 0 AND status = 'active')
      ORDER BY createdAt DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;

    return await Promise.all(
      images.map(async (image) => {
        const user = await this.usersService.findById(image.userId);

        return {
          ...image,
          user,
        };
      }),
    );
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

  async visitRanking({
    page = 1,
    count = 10,
    countryIso2,
    date,
  }: CityRankingDto): Promise<CityVisitRankingDto[]> {
    return await this.prisma.$queryRaw<CityVisitRankingDto[]>`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};
      DECLARE @date INT = ${date || null};
      DECLARE @countryIso2 VARCHAR(50) = ${countryIso2 || null};

      SELECT ci.*, r.name AS region, c.iso2, c.name AS country, COUNT(cv.id) AS totalVisit
      FROM [dbo].[City] ci
      JOIN [dbo].[Region] r ON ci.regionId = r.id
      JOIN [dbo].[Country] c ON c.id = r.countryId
      JOIN [dbo].[CityVisit] cv ON ci.id = cv.cityId
      WHERE (c.iso2 = @countryIso2 OR @countryIso2 is NULL)
      AND (DATEDIFF(DAY, cv.createdAt, GETDATE()) <= @date OR @date IS NULL)
      GROUP BY ci.name, ci.latitude, ci.longitude, ci.id, ci.regionId, r.name, c.iso2, c.name
      ORDER BY totalVisit DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async ratingRanking({
    page = 1,
    count = 10,
    countryIso2,
    date,
  }: CityRankingDto) {
    return await this.prisma.$queryRaw<CityRatingRankingDto[]>`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};
      DECLARE @date INT = ${date || null};
      DECLARE @countryIso2 VARCHAR(50) = ${countryIso2 || null};

      SELECT ci.*, r.name AS region, c.iso2, c.name AS country, ROUND(AVG(CAST(cv.rating AS FLOAT)), 1) AS averageRating
      FROM [dbo].[City] ci
      JOIN [dbo].[Region] r ON ci.regionId = r.id
      JOIN [dbo].[Country] c ON c.id = r.countryId
      JOIN [dbo].[CityVisit] cv ON ci.id = cv.cityId
      WHERE (c.iso2 = @countryIso2 OR @countryIso2 IS NULL)
      AND (DATEDIFF(DAY, cv.createdAt, GETDATE()) <= @date OR @date IS NULL)
      GROUP BY ci.name, ci.latitude, ci.longitude, ci.id, ci.regionId, r.name, c.iso2, c.name
      HAVING ROUND(AVG(CAST(cv.rating AS FLOAT)), 1) IS NOT NULL
      ORDER BY averageRating DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }
}
