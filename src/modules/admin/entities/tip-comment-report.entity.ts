import { ApiProperty } from '@nestjs/swagger';
import { TipCommentReport } from '@prisma/client';

export class TipCommentReportEntity implements TipCommentReport {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tipCommentId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
}
