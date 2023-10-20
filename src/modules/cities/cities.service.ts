import { Injectable } from '@nestjs/common';
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
        country: {
          iso2: countryIso2,
        },
      },
    });
  }
}
