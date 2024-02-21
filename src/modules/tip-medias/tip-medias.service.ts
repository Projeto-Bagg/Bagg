import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipMediaDto } from './dtos/create-tip-media.dto';
import { UpdateTipMediaDto } from './dtos/update-tip-media.dto';

@Injectable()
export class TipMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTipMediaDto: CreateTipMediaDto) {
    return this.prisma.tipMedia.create({ data: createTipMediaDto });
  }

  findAll() {
    return this.prisma.tipMedia.findMany();
  }

  findOne(id: number) {
    return this.prisma.tipMedia.findUnique({ where: { id: id } });
  }

  update(id: number, updateTipMediaDto: UpdateTipMediaDto) {
    return this.prisma.tipMedia.update({
      data: updateTipMediaDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.tipMedia.delete({ where: { id: id } });
  }
}
