import { ApiProperty } from '@nestjs/swagger';
import { TipReport } from '@prisma/client';
import { ReportEntity } from 'src/modules/admin/entities/report.entity';

export class TipReportEntity extends ReportEntity implements TipReport {
  @ApiProperty()
  tipId: number;
<<<<<<< Updated upstream

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
=======
>>>>>>> Stashed changes
}
