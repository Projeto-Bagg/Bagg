import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ReportReasonEnum } from 'src/modules/admin/entities/report.entity';

export class CreateTipCommentReportDto {
  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(ReportReasonEnum)
  reason: string;
}
