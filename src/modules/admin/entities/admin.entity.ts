import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '@prisma/client';

export class AdminEntity implements Admin {
  @ApiProperty()
  accountId: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  privilege: number;
}
