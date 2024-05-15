import { ApiProperty } from '@nestjs/swagger';

class ReasonCountDto {
  @ApiProperty()
  reason: number;
}

export class ReportReasonDto {
  @ApiProperty({ type: ReasonCountDto })
  _count: ReasonCountDto;

  @ApiProperty()
  reason: string;
}
