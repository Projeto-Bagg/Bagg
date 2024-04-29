import { ApiProperty } from '@nestjs/swagger';

export class UserFromJwt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  hasEmailBeenVerified?: boolean;
}
