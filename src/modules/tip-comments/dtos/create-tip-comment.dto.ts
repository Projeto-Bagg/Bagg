import { ApiProperty } from '@nestjs/swagger';

export class CreateTipCommentDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  message: string;
}
