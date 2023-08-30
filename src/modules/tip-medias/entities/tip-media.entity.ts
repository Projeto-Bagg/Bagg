import { ApiProperty } from '@nestjs/swagger';

export class TipMedia {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  tipId: string;
}
