import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
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
  emailVerified: boolean;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  image: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;
}
