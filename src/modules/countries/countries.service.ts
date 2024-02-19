import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.country.findMany();
  }

  findByIso2(iso2: string) {
    return this.prisma.country.findUnique({
      where: { iso2 },
    });
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
}
