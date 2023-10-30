import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  image?: string | null;

  @ApiPropertyOptional()
  @MaxLength(300)
  bio?: string | undefined;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  profilePic?: Express.Multer.File;
}
