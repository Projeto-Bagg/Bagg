import { ApiProperty } from '@nestjs/swagger';

export class Tip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;
}
