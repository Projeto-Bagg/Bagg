import { ApiProperty } from '@nestjs/swagger';
import { ReportReasonDto } from 'src/modules/admin/dto/report-reason.dto';
import { DiaryPostClientDto } from 'src/modules/diary-posts/dtos/diary-post-client.dto';

export class DiaryPostReportDto extends DiaryPostClientDto {
  @ApiProperty({ type: ReportReasonDto, isArray: true })
  reasons: ReportReasonDto[];
}
