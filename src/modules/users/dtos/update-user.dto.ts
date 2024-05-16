import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  image?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(300)
  bio?: string | null;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  profilePic?: Express.Multer.File;

  @ApiPropertyOptional()
  @Type(() => Number)
  cityId?: number | null;
}
