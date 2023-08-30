import { ApiProperty } from '@nestjs/swagger';

export class UserClient {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
