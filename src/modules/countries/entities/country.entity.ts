import { ApiProperty } from '@nestjs/swagger';

export class Country {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;
}
