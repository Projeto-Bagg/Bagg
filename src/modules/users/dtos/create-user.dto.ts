import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  birthdate: Date;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
