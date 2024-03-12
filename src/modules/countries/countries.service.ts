import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryInterestRankingDto } from 'src/modules/countries/dtos/country-interest-ranking.dto';
import { CountryRatingRankingDto } from 'src/modules/countries/dtos/country-rating-ranking.dto';
import { CountrySearchDto } from 'src/modules/countries/dtos/country-search.dto';
import { CountryVisitRankingDto } from 'src/modules/countries/dtos/country-visit-ranking.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByIso2(iso2: string): Promise<CountryEntity> {
    const country = await this.prisma.country.findUnique({
      where: { iso2 },
    });

    if (!country) {
      throw new NotFoundException();
    }

    return country;
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

  async interestRanking(
    page = 1,
    count = 10,
  ): Promise<CountryInterestRankingDto[]> {
    return await this.prisma.$queryRaw<CountryInterestRankingDto[]>`
     SELECT c.name, c.iso2,
        COUNT(ci.userId) AS totalInterest
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityInterest] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY totalInterest DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `;
  }

  async visitRanking(page = 1, count = 10): Promise<CountryVisitRankingDto[]> {
    return await this.prisma.$queryRaw<CountryVisitRankingDto[]>`
     SELECT c.name, c.iso2,
        COUNT(ci.userId) AS totalVisit
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityVisit] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY totalVisit DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `;
  }

  async ratingRanking(
    page = 1,
    count = 10,
  ): Promise<CountryRatingRankingDto[]> {
    return await this.prisma.$queryRaw<CountryRatingRankingDto[]>`
      SELECT c.name, c.iso2, ROUND(AVG(CAST(ci.rating AS FLOAT)), 1) AS averageRating
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityVisit] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY averageRating DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `;
  }
}
