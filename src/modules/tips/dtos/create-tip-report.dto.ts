import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ReportReasonEnum } from 'src/modules/admin/entities/report.entity';

export class CreateTipReportDto {
  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(ReportReasonEnum)
  reason: string;
}
