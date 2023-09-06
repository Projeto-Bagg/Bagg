import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipLikeDto } from './dto/create-tip-like.dto';
import { UpdateTipLikeDto } from './dto/update-tip-like.dto';

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

  findAll() {
    return this.prisma.tipLike.findMany();
  }

  findOne(id: number) {
    return this.prisma.tipLike.findUnique({ where: { id: id } });
  }

  update(id: number, updateTipLikeDto: UpdateTipLikeDto) {
    return this.prisma.tipLike.update({
      data: updateTipLikeDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.tipLike.delete({ where: { id: id } });
  }
}
