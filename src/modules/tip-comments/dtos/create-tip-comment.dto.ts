import { ApiProperty } from '@nestjs/swagger';

export class CreateTipCommentDto {
  @ApiProperty()
  tipId: number;

  @ApiProperty()
  message: string;
}
