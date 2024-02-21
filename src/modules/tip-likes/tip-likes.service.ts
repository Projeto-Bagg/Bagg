import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipLikeDto } from './dtos/create-tip-like.dto';
import { UpdateTipLikeDto } from './dtos/update-tip-like.dto';

@Injectable()
export class TipLikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTipLikeDto: CreateTipLikeDto) {
    return this.prisma.tipLike.create({
      data: {
        user: {
          connect: { id: createTipLikeDto.userId },
        },
        tip: {
          connect: { id: createTipLikeDto.tipId },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.tipLike.delete({ where: { id: id } });
  }
}
