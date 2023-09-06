import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

@Injectable()
export class RegionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({ data: createRegionDto });
  }

  findAll() {
    return this.prisma.region.findMany();
  }

  findOne(id: number) {
    return this.prisma.region.findUnique({ where: { id: id } });
  }

  update(id: number, updateRegionDto: UpdateRegionDto) {
    return this.prisma.region.update({
      data: updateRegionDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.region.delete({ where: { id: id } });
  }
}
