import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipMediaDto } from './dtos/create-tip-media.dto';
import { TipMediaEntity } from 'src/modules/tip-medias/entities/tip-media.entity';

@Injectable()
export class TipMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTipMediaDto: CreateTipMediaDto): Promise<TipMediaEntity> {
    return this.prisma.tipMedia.create({ data: createTipMediaDto });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.tipMedia.delete({ where: { id: id } });
  }
}
