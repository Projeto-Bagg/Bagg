import { ApiProperty } from '@nestjs/swagger';

export class MediaEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  url: string;
}
