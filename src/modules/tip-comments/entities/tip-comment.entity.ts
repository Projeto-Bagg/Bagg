import { ApiProperty } from '@nestjs/swagger';

export class TipComment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  message: string;
}
