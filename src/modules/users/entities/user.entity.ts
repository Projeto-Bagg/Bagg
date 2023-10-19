import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @Exclude()
  email: string;

  @ApiProperty()
  bio: string;

  @Exclude()
  emailVerified: boolean;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  image: string;

  @Exclude()
  password: string;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: UserEntity) {
    Object.assign(this, partial);
  }
}
