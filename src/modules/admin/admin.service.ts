import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipReportEntity } from 'src/modules/admin/entities/tip-report.entity';
import { TipCommentReportEntity } from 'src/modules/admin/entities/tip-comment-report.entity';
import { DiaryPostReportEntity } from 'src/modules/admin/entities/diary-post-report.entity';
import { CreateAdminDto } from 'src/modules/admin/dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAdminDto: CreateAdminDto) {
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

  async findById(id: number) {
    return this.prismaService.admin.findUnique({
      where: {
        id,
      },
    });
  }

  async overview() {
    return 'overview';
  }

  async tipReports(page = 1, count = 10): Promise<TipReportEntity[]> {
    const posts = this.prismaService.tipReport.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        tip: {
          status: 'in-review',
        },
      },
    });

    return posts;
  }

  async tipCommentReports(
    page = 1,
    count = 10,
  ): Promise<TipCommentReportEntity[]> {
    const posts = this.prismaService.tipCommentReport.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        tipComment: {
          status: 'in-review',
        },
      },
    });

    return posts;
  }

  async diaryPostReports(
    page = 1,
    count = 10,
  ): Promise<DiaryPostReportEntity[]> {
    const posts = this.prismaService.diaryPostReport.findMany({
      skip: count * (page - 1),
      take: count,
      where: {
        diaryPost: {
          status: 'in-review',
        },
      },
    });

    return posts;
  }
}
