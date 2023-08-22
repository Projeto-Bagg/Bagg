import { ApiProperty } from '@nestjs/swagger';

export class UserFromJwt {
  @ApiProperty()
  id: string;
}
