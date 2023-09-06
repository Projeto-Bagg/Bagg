import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityVisitDto } from './dto/create-city-visit.dto';
import { UpdateCityVisitDto } from './dto/update-city-visit.dto';

@Injectable()
export class CityVisitsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCityVisitDto: CreateCityVisitDto) {
    return this.prisma.cityVisit.create({ data: createCityVisitDto });
  }

  findAll() {
    return this.prisma.cityVisit.findMany();
  }

  findOne(id: number) {
    return this.prisma.cityVisit.findUnique({ where: { id: id } });
  }

  update(id: number, updateCityVisitDto: UpdateCityVisitDto) {
    return this.prisma.cityVisit.update({
      data: updateCityVisitDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.cityVisit.delete({ where: { id: id } });
  }
}
