import { ApiProperty } from '@nestjs/swagger';
import { TipMedia } from '@prisma/client';

export class TipMediaEntity implements TipMedia {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  createdAt: Date;
}
