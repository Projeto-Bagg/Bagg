import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCityInterestDto } from './dto/create-city-interest.dto';
import { UpdateCityInterestDto } from './dto/update-city-interest.dto';

@Injectable()
export class CityInterestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCityInterestDto: CreateCityInterestDto) {
    return this.prisma.cityInterest.create({ data: createCityInterestDto });
  }

  findAll() {
    return this.prisma.cityInterest.findMany();
  }

  findOne(id: number) {
    return this.prisma.cityInterest.findUnique({ where: { id: id } });
  }

  update(id: number, updateCityInterestDto: UpdateCityInterestDto) {
    return this.prisma.cityInterest.update({
      data: updateCityInterestDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.cityInterest.delete({ where: { id: id } });
  }
}
