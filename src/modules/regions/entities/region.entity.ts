import { ApiProperty } from '@nestjs/swagger';

export class Region {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  countryId: number;
}
