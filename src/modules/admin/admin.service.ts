import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from 'src/modules/admin/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { TipCommentEntity } from 'src/modules/tip-comments/entities/tip-comment.entity';
import { DiaryPost, Tip, TipComment } from '@prisma/client';
import { DiaryPostClientDto } from 'src/modules/diary-posts/dtos/diary-post-client.dto';
import { TipClientDto } from 'src/modules/tips/dtos/tip-client.dto';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';

interface TipDelegate {
  update({ where: { id }, data: { status } }): Promise<Tip>;
}

interface TipCommentDelegate {
  update({ where: { id }, data: { status } }): Promise<TipComment>;
}

interface DiaryPostDelegate {
  update({ where: { id }, data: { status } }): Promise<DiaryPost>;
}

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto): Promise<void> {
    const account = await this.prismaService.account.create({
      data: {
        email: createAdminDto.email,
        password: await bcrypt.hash(createAdminDto.password, 10),
      },
    });

    await this.prismaService.admin.create({
      data: {
        id: account.id,
        account: {
          connect: {
            id: account.id,
          },
        },
      },
    });
  }

  async findById(id: number): Promise<AdminEntity> {
    const admin = await this.prismaService.admin.findUnique({
      where: {
        id,
      },
    });

    if (!admin) {
      throw new NotFoundException();
    }

    return admin;
  }

  async overview() {
    return 'overview';
  }

  async tipReports(page = 1, count = 10): Promise<TipClientDto[]> {
    const posts = await this.prismaService.tip.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        status: 'in-review',
      },
      orderBy: {
        tipReport: {
          _count: 'desc',
        },
      },
      include: {
        tipMedias: true,
        likedBy: true,
        user: true,
        city: {
          include: {
            region: {
              include: {
                country: true,
              },
            },
          },
        },
        _count: {
          select: {
            tipReport: true,
          },
        },
      },
    });

    return await Promise.all(
      posts.map(async (post) => {
        const reasons = await this.prismaService.tipReport.groupBy({
          by: 'reason',
          orderBy: {
            _count: {
              reason: 'desc',
            },
          },
          _count: {
            reason: true,
          },
          where: {
            tip: { id: post.id },
          },
        });

        return {
          ...post,
          reasons,
          isLiked: false,
          likesAmount: post.likedBy.length,
          commentsAmount: 0,
        };
      }),
    );
  }

  async tipCommentReports(page = 1, count = 10): Promise<TipCommentEntity[]> {
    const tipComments = await this.prismaService.tipComment.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        status: 'in-review',
      },
      orderBy: {
        tipCommentReport: {
          _count: 'desc',
        },
      },
      include: {
        user: true,
        _count: {
          select: {
            tipCommentReport: true,
          },
        },
      },
    });

    return await Promise.all(
      tipComments.map(async (tipComment) => {
        const reasons = await this.prismaService.tipCommentReport.groupBy({
          by: 'reason',
          orderBy: {
            _count: {
              reason: 'desc',
            },
          },
          _count: {
            reason: true,
          },
          where: {
            tipComment: { id: tipComment.id },
          },
        });

        return {
          ...tipComment,
          reasons,
        };
      }),
    );
  }

  async diaryPostReports(page = 1, count = 10): Promise<DiaryPostClientDto[]> {
    const posts = await this.prismaService.diaryPost.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        status: 'in-review',
      },
      orderBy: {
        diaryPostReport: {
          _count: 'desc',
        },
      },
      include: {
        diaryPostMedias: true,
        likedBy: true,
        user: true,
        tripDiary: true,
        _count: {
          select: {
            diaryPostReport: true,
          },
        },
      },
    });

    return await Promise.all(
      posts.map(async (post) => {
        const reasons = await this.prismaService.diaryPostReport.groupBy({
          by: 'reason',
          orderBy: {
            _count: {
              reason: 'desc',
            },
          },
          _count: {
            reason: true,
          },
          where: {
            diaryPost: { id: post.id },
          },
        });

        return {
          ...post,
          reasons,
          likesAmount: post.likedBy.length,
          isLiked: false,
        };
      }),
    );
  }

  async rejectReport(
    id: number,
    model: TipDelegate | TipCommentDelegate | DiaryPostDelegate,
  ) {
    await model.update({ data: { status: 'active' }, where: { id } });
  }

  async rejectTipReport(id: number) {
    await this.rejectReport(id, this.prismaService.tip);
    await this.prismaService.tipReport.updateMany({
      where: { tipId: id },
      data: {
        reviewed: true,
      },
    });
  }

  async rejectTipCommentReport(id: number) {
    await this.rejectReport(id, this.prismaService.tipComment);
    await this.prismaService.tipCommentReport.updateMany({
      where: { tipCommentId: id },
      data: {
        reviewed: true,
      },
    });
  }

  async rejectDiaryPostReport(id: number) {
    await this.rejectReport(id, this.prismaService.diaryPost);
    await this.prismaService.diaryPostReport.updateMany({
      where: {
        diaryPostId: id,
      },
      data: {
        reviewed: true,
      },
    });
  }

  async acceptReport(
    id: number,
    model: TipDelegate | TipCommentDelegate | DiaryPostDelegate,
  ) {
    await model.update({ data: { status: 'not-active' }, where: { id } });
  }

  async acceptTipReport(id: number) {
    await this.acceptReport(id, this.prismaService.tip);
    await this.prismaService.tipReport.updateMany({
      where: { tipId: id },
      data: {
        reviewed: true,
      },
    });
  }

  async acceptTipCommentReport(id: number) {
    await this.acceptReport(id, this.prismaService.tipComment);
    await this.prismaService.tipCommentReport.updateMany({
      where: { tipCommentId: id },
      data: {
        reviewed: true,
      },
    });
  }

  async acceptDiaryPostReport(id: number) {
    await this.acceptReport(id, this.prismaService.diaryPost);
    await this.prismaService.diaryPostReport.updateMany({
      where: {
        diaryPostId: id,
      },
      data: {
        reviewed: true,
      },
    });
  }
}
