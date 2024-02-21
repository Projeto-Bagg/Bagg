import { ApiProperty } from '@nestjs/swagger';

export class CreateTipLikeDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;
}
