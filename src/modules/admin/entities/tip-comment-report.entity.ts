import { ApiProperty } from '@nestjs/swagger';
import { TipCommentReport } from '@prisma/client';
import { ReportEntity } from 'src/modules/admin/entities/report.entity';

export class TipCommentReportEntity
  extends ReportEntity
  implements TipCommentReport
{
  @ApiProperty()
  tipCommentId: number;
<<<<<<< Updated upstream

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
=======
>>>>>>> Stashed changes
}
