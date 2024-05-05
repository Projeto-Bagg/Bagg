import { Injectable } from '@nestjs/common';
import { ContinentEntity } from 'src/modules/continents/entities/continent.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContinentsService {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(): Promise<ContinentEntity[]> {
    return this.prismaService.continent.findMany();
  }
}
