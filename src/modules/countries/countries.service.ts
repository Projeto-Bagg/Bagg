import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.country.findMany();
  }

  findByIso2(iso2: string) {
    return this.prisma.country.findUnique({ where: { iso2 } });
  }
}
