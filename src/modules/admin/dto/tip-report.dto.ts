import { ApiProperty } from '@nestjs/swagger';
import { ReportReasonDto } from 'src/modules/admin/dto/report-reason.dto';
import { TipClientDto } from 'src/modules/tips/dtos/tip-client.dto';

export class TipReportDto extends TipClientDto {
  @ApiProperty({ type: ReportReasonDto, isArray: true })
  reasons: ReportReasonDto[];
}
