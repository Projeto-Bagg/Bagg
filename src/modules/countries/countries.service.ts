import { Injectable, NotFoundException } from '@nestjs/common';
import { CountrySearchDto } from 'src/modules/countries/entities/country-search.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.country.findMany();
  }

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
    return (await this.prisma.$queryRaw`
      DECLARE @page INT = ${query.page || 1};
      DECLARE @count INT = ${query.count};

      SELECT *
      FROM [dbo].[Country] as c
      WHERE CONTAINS(name, ${'"' + query.q + '*"'})
      ORDER BY c.id DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `) as CountryEntity[];
  }

  mostInterestedRanking(page: number, count: number) {
    return this.prisma.$queryRaw`
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

  mostVisitedRanking(page: number, count: number) {
    return this.prisma.$queryRaw`
     SELECT c.name, c.iso2,
       COUNT(ci.userId) AS cityVisit
      FROM [dbo].[Country] c
      JOIN [dbo].[Region] r ON c.id = r.countryId
      JOIN [dbo].[City] ct ON r.id = ct.regionId
      JOIN [dbo].[CityVisit] ci ON ct.id = ci.cityId
      GROUP BY c.name, c.iso2
      ORDER BY cityVisit DESC
      OFFSET ${count * (page - 1)} ROWS
      FETCH NEXT ${+count} ROWS ONLY
    `;
  }
}
