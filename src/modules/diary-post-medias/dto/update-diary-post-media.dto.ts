import { PartialType } from '@nestjs/swagger';
import { CreateDiaryPostMediaDto } from './create-diary-post-media.dto';

export class UpdateDiaryPostMediaDto extends PartialType(CreateDiaryPostMediaDto) {}
