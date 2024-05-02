import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipReportEntity } from 'src/modules/admin/entities/tip-report.entity';
import { TipCommentReportEntity } from 'src/modules/admin/entities/tip-comment-report.entity';
import { DiaryPostReportEntity } from 'src/modules/admin/entities/diary-post-report.entity';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  async overview() {
    return 'overview';
  }

  async tipReports(page = 1, count = 10): Promise<TipReportEntity[]> {
    const posts = this.prismaService.tipReport.findMany({
      skip: count * (page - 1),
      take: count,
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
    });

    return posts;
  }
}
