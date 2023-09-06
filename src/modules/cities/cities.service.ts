import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCityDto: CreateCityDto) {
    return this.prisma.city.create({ data: createCityDto });
  }

  findAll() {
    return this.prisma.city.findMany();
  }

  findOne(id: number) {
    return this.prisma.city.findUnique({ where: { id: id } });
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return this.prisma.city.update({ data: updateCityDto, where: { id: id } });
  }

  remove(id: number) {
    return this.prisma.city.delete({ where: { id: id } });
  }
}
