import { ApiProperty } from '@nestjs/swagger';

export class City {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  regionId: number;

  @ApiProperty()
  message: string;
}
