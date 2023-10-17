import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  fullName: string;

  @ApiProperty()
  @Matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![.])$/, {
    message: 'Invalid username',
  })
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: 'Password too weak' },
  )
  password: string;
}
