import { ApiProperty } from '@nestjs/swagger';

export class UserClient {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
