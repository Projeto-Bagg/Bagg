import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipMediaDto } from './dtos/create-tip-media.dto';

@Injectable()
export class TipMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTipMediaDto: CreateTipMediaDto) {
    return this.prisma.tipMedia.create({ data: createTipMediaDto });
  }

  remove(id: number) {
    return this.prisma.tipMedia.delete({ where: { id: id } });
  }
}
