import { ApiProperty } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;
}
