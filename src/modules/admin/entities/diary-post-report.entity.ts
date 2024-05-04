import { ApiProperty } from '@nestjs/swagger';
import { DiaryPostReport } from '@prisma/client';
import { ReportEntity } from 'src/modules/admin/entities/report.entity';

export class DiaryPostReportEntity
  extends ReportEntity
  implements DiaryPostReport
{
  @ApiProperty()
  diaryPostId: number;
<<<<<<< Updated upstream

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;
=======
>>>>>>> Stashed changes
}
