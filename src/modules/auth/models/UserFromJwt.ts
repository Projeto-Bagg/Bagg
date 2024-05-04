import { ApiProperty } from '@nestjs/swagger';

export class UserFromJwt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  hasEmailBeenVerified?: boolean;

  @ApiProperty()
  role?: string;
}
