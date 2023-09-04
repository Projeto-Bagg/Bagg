import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  displayName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  emailVerified: Date;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  image: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;
}
