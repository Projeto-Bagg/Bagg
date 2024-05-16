import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTipCommentDto } from './dtos/create-tip-comment.dto';
import { TipCommentEntity } from './entities/tip-comment.entity';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CreateTipCommentReportDto } from 'src/modules/tip-comments/dtos/create-tip-comment-report.dto';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';

@Injectable()
export class TipCommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cityInterestsService: CityInterestsService,
  ) {}

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
      where: { tipId, softDelete: false, status: 'active' },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async report(
    id: number,
    createTipCommentReportDto: CreateTipCommentReportDto,
    currentUser: UserFromJwt,
  ): Promise<void> {
    await this.prisma.tipCommentReport.create({
      data: {
        reason: createTipCommentReportDto.reason,
        tipComment: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const minReportsLength = 7;

    const reportsLength = await this.prisma.tipCommentReport.count({
      where: { AND: [{ tipCommentId: id }, { reviewed: false }] },
    });

    if (reportsLength <= minReportsLength) {
      return;
    }

    const tipComment = await this.prisma.tipComment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          include: {
            followers: true,
          },
        },
        tip: {
          include: {
            likedBy: true,
          },
        },
      },
    });

    if (!tipComment) {
      return;
    }

    const interestAmountInCity =
      await this.cityInterestsService.getInterestsCountByCityId(
        tipComment.tip.cityId,
      );

    const commentsAmount = await this.getTipCommentsAmount(tipComment.tip.id);

    const interactions =
      tipComment.tip.likedBy.length +
      tipComment.user.followers.length +
      interestAmountInCity * 0.3 +
      commentsAmount;

    if (
      Math.ceil(
        (Math.log2(interactions) / 100) * 0.05 * interactions +
          minReportsLength,
      ) >= reportsLength
    ) {
      await this.prisma.tipComment.update({
        where: { id },
        data: {
          status: 'in-review',
        },
      });
    }
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

    await this.prisma.tipComment.update({
      data: { softDelete: true },
      where: { id: id },
    });
  }
}
