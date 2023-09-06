import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCountryDto: CreateCountryDto) {
    return this.prisma.country.create({ data: createCountryDto });
  }

  findAll() {
    return this.prisma.country.findMany();
  }

  findOne(id: number) {
    return this.prisma.country.findUnique({ where: { id: id } });
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return this.prisma.country.update({
      data: updateCountryDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.country.delete({ where: { id: id } });
  }
}
