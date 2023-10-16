import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Matches(/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/, {
    message: 'Invalid name',
  })
  fullName: string;

  @ApiProperty()
  @Matches(/^(?=.{3,16}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![.])$/, {
    message: 'Invalid username',
  })
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
  @Matches(
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/,
    { message: 'Password too weak' },
  )
  password: string;
}
