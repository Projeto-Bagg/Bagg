import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipCommentDto } from './dtos/create-tip-comment.dto';
import { TipCommentEntity } from './entities/tip-comment.entity';
import { UserFromJwt } from '../auth/models/UserFromJwt';

@Injectable()
export class TipCommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTipCommentDto: CreateTipCommentDto,
    currentUser: UserFromJwt,
  ): Promise<TipCommentEntity> {
    return await this.prisma.tipComment.create({
      data: { ...createTipCommentDto, userId: currentUser.id },
      include: {
        user: true,
      },
    });
  }

  findByTip(tipId: number): Promise<TipCommentEntity[]> {
    return this.prisma.tipComment.findMany({
      where: { tipId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getTipCommentsAmount(tipId: number): Promise<number> {
    return this.prisma.tipComment.count({
      where: {
        tipId,
      },
    });
  }

  async delete(id: number, currentUser: UserFromJwt): Promise<void> {
    const comment = await this.prisma.tipComment.findUnique({
      where: {
        id,
      },
    });

    if (!comment) {
      throw new NotFoundException();
    }

    if (comment.userId !== currentUser.id) {
      throw new UnauthorizedException();
    }

    await this.prisma.tipComment.delete({ where: { id: id } });
  }
}
