import { ApiProperty } from '@nestjs/swagger';

export class tipLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;
}
