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

  update(id: number, UpdateTipDto: UpdateTipDto) {
    return this.prisma.tip.update({ where: { id }, data: UpdateTipDto });
  }

  delete(id: number) {
    return this.prisma.tip.delete({ where: { id } });
  }
}
