import { ApiProperty } from '@nestjs/swagger';
import { TipReport } from '@prisma/client';

export class TipReportEntity implements TipReport {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
}
