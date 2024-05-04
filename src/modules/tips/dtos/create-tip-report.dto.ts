import { ApiProperty } from '@nestjs/swagger';

export class CreateTipReportDto {
  @ApiProperty()
  reason: string;
}
