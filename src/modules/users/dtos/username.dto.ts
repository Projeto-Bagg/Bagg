import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, Matches } from 'class-validator';

export class UsernameDto {
  @ApiProperty()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Invalid username',
  })
  username: string;
}
