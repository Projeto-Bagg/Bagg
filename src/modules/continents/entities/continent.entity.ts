import { ApiProperty } from '@nestjs/swagger';
import { Continent } from '@prisma/client';

export class ContinentEntity implements Continent {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
