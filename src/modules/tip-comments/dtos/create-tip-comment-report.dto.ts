import { ApiProperty } from '@nestjs/swagger';

export class CreateTipCommentReportDto {
  @ApiProperty()
  reason: string;
}
