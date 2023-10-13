import { ApiProperty } from '@nestjs/swagger';

export class UserClient {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  image: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;
}
