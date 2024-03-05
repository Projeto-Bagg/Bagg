import { Injectable } from '@nestjs/common';
import { CreateTipDto } from './dtos/create-tip.dto';
import { UpdateTipDto } from './dtos/update-tip.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TipsService {
  constructor(private readonly prisma: PrismaService) {}

  create(CreateTipDto: CreateTipDto) {
    return this.prisma.tip.create({ data: CreateTipDto });
  }

  findMany() {
    return this.prisma.tip.findMany();
  }

  findUnique(id: number) {
    return this.prisma.tip.findUnique({ where: { id } });
  }

  async findByUserCityInterest(userId: number, tipCount = 10, currentPage = 1) {
    const cities = (
      await this.prisma.cityInterest.findMany({
        where: { userId },
        select: { cityId: true },
      })
    ).map((city) => city.cityId);

    const index = tipCount * (currentPage - 1);

    return await this.prisma.tip.findMany({
      skip: index,
      take: tipCount,
      where: { cityId: { in: cities } },
    });
  }

  update(id: number, UpdateTipDto: UpdateTipDto) {
    return this.prisma.tip.update({ where: { id }, data: UpdateTipDto });
  }

  delete(id: number) {
    return this.prisma.tip.delete({ where: { id } });
  }
}
