import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipCommentDto } from './dtos/create-tip-comment.dto';
import { UpdateTipCommentDto } from './dtos/update-tip-comment.dto';

@Injectable()
export class TipCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTipCommentDto: CreateTipCommentDto) {
    return this.prisma.tipComment.create({ data: createTipCommentDto });
  }

  findAll() {
    return this.prisma.tipComment.findMany();
  }

  findOne(id: number) {
    return this.prisma.tipComment.findUnique({ where: { id: id } });
  }

  update(id: number, updateTipCommentDto: UpdateTipCommentDto) {
    return this.prisma.tipComment.update({
      data: updateTipCommentDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.tipComment.delete({ where: { id: id } });
  }
}
