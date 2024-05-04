import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryPostReportDto {
  @ApiProperty()
  reason: string;
}
