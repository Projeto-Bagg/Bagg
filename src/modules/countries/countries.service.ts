import { Injectable, NotFoundException } from '@nestjs/common';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { CountryImageDto } from 'src/modules/countries/dtos/country-image.dto';
import { CountryInterestRankingDto } from 'src/modules/countries/dtos/country-interest-ranking.dto';
import { CountryPageDto } from 'src/modules/countries/dtos/country-page.dto';
import { CountryRatingRankingDto } from 'src/modules/countries/dtos/country-rating-ranking.dto';
import { CountrySearchDto } from 'src/modules/countries/dtos/country-search.dto';
import { CountryVisitRankingDto } from 'src/modules/countries/dtos/country-visit-ranking.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { UsersService } from 'src/modules/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cityVisitsService: CityVisitsService,
    private readonly cityInterestsService: CityInterestsService,
    private readonly usersService: UsersService,
  ) {}

  async findByIso2(iso2: string): Promise<CountryPageDto> {
    const country = await this.prisma.country.findUnique({
      where: { iso2 },
    });

    if (!country) {
      throw new NotFoundException();
    }

    const averageRating =
      await this.cityVisitsService.getCountryAverageRatingByIso2(country.iso2);

    const visitsCount =
      await this.cityVisitsService.getCountryVisitsCountByIso2(country.iso2);

    const interestsCount =
      await this.cityInterestsService.getCountryInterestsCountByIso2(
        country.iso2,
      );

    return {
      ...country,
      averageRating,
      visitsCount,
      interestsCount,
    };
  }

  async search(query: CountrySearchDto): Promise<CountryEntity[]> {
    return await this.prisma.$queryRaw<CountryEntity[]>`
      DECLARE @page INT = ${query.page || 1};
      DECLARE @count INT = ${query.count || 10};

      SELECT *
      FROM [dbo].[Country] as c
      WHERE CONTAINS(name, ${'"' + query.q + '*"'})
      ORDER BY c.id DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async getCountryImages(
    iso2: string,
    page = 1,
    count = 10,
  ): Promise<CountryImageDto[]> {
    const images = await this.prisma.$queryRaw<
      (MediaEntity & {
        userId: number;
        cityName: string;
        cityId: number;
        cityRegionId: number;
        cityLatitude: number;
        cityLongitude: number;
      })[]
    >`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};

      (SELECT m.id, m.url, m.createdAt, td.userId, c.id as cityId, c.name as cityName, c.regionId as cityRegionId, c.latitude as cityLatitude, c.longitude as cityLongitude
      FROM [dbo].[DiaryPostMedia] m
      JOIN [dbo].[DiaryPost] dp ON dp.id = m.diaryPostId
      JOIN [dbo].[TripDiary] td ON td.id = dp.tripDiaryId
      JOIN [dbo].[City] c ON td.cityId = c.id
      JOIN [dbo].[Region] r ON c.regionId = r.id
      JOIN [dbo].[Country] co ON r.countryId = co.id
      WHERE co.iso2 = ${iso2})
      UNION ALL
      (SELECT m.id, m.url, m.createdAt, t.userId, c.id as cityId, c.name as cityName, c.regionId as cityRegionId, c.latitude as cityLatitude, c.longitude as cityLongitude
      FROM [dbo].[TipMedia] m
      JOIN [dbo].[Tip] t ON t.id = m.tipId
      JOIN [dbo].[City] c ON t.cityId = c.id
      JOIN [dbo].[Region] r ON c.regionId = r.id
      JOIN [dbo].[Country] co ON r.countryId = co.id
      WHERE co.iso2 = ${iso2})
      ORDER BY createdAt DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;

    return await Promise.all(
      images.map(async (image) => {
        const user = await this.usersService.findById(image.userId);

        return {
          id: image.id,
          createdAt: image.createdAt,
          url: image.url,
          userId: image.userId,
          user,
          city: {
            id: image.cityId,
            name: image.cityName,
            regionId: image.cityRegionId,
            latitude: image.cityLatitude,
            longitude: image.cityLongitude,
          },
        };
      }),
    );
  }

  async interestRanking(
    page = 1,
    count = 10,
  ): Promise<CountryInterestRankingDto[]> {
    return await this.prisma.$queryRaw<CountryInterestRankingDto[]>`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};

      SELECT c.name, c.iso2,
        COUNT(ci.userId) AS totalInterest
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityInterest] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY totalInterest DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async visitRanking(page = 1, count = 10): Promise<CountryVisitRankingDto[]> {
    return await this.prisma.$queryRaw<CountryVisitRankingDto[]>`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};

      SELECT c.name, c.iso2,
        COUNT(ci.userId) AS totalVisit
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityVisit] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY totalVisit DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async ratingRanking(
    page = 1,
    count = 10,
  ): Promise<CountryRatingRankingDto[]> {
    return await this.prisma.$queryRaw<CountryRatingRankingDto[]>`
      DECLARE @page INT = ${page};
      DECLARE @count INT = ${count};

      SELECT c.name, c.iso2, ROUND(AVG(CAST(ci.rating AS FLOAT)), 1) AS averageRating
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityVisit] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY averageRating DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }
}
