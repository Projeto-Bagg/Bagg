import { ApiProperty } from '@nestjs/swagger';
import { Tip } from '@prisma/client';

export class TipEntity implements Tip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;
}
