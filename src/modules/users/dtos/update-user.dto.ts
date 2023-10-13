import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  'profile-pic'?: Express.Multer.File;
}
