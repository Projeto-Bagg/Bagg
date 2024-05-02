import { ApiProperty } from '@nestjs/swagger';
import { DiaryPostReport } from '@prisma/client';

export class DiaryPostReportEntity implements DiaryPostReport {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  diaryPostId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
}
