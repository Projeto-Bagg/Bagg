import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from 'src/modules/admin/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { DiaryPost, Tip, TipComment } from '@prisma/client';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { AdminDashboardDto } from 'src/modules/admin/dto/admin-dashboard';
import { TipReportDto } from 'src/modules/admin/dto/tip-report.dto';
import { DiaryPostReportDto } from 'src/modules/admin/dto/diary-post-report.dto';
import { TipCommentReportDto } from 'src/modules/admin/dto/tip-comment-report.dto';

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

  async dashboard(): Promise<AdminDashboardDto> {
    const totalUsers = await this.prismaService.user.count();

    const totalPosts =
      (await this.prismaService.tip.count({
        where: { status: 'active' },
      })) +
      (await this.prismaService.diaryPost.count({
        where: { status: 'active' },
      })) +
      (await this.prismaService.tipComment.count({
        where: { status: 'active' },
      }));

    const totalReports =
      (await this.prismaService.tipReport.count({
        where: { reviewed: false },
      })) +
      (await this.prismaService.diaryPostReport.count({
        where: { reviewed: false },
      })) +
      (await this.prismaService.tipCommentReport.count({
        where: {
          reviewed: false,
        },
      }));

    return {
      totalUsers,
      totalPosts,
      totalReports,
    };
  }

  async tipReports(page = 1, count = 10): Promise<TipReportDto[]> {
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

  async tipCommentReports(
    page = 1,
    count = 10,
  ): Promise<TipCommentReportDto[]> {
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

  async diaryPostReports(page = 1, count = 10): Promise<DiaryPostReportDto[]> {
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

  private async rejectReport(
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

  private async acceptReport(
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
