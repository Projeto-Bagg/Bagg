import { PartialType } from '@nestjs/swagger';
import { CreateDiaryPostDto } from './create-diary-post.dto';

export class UpdateDiaryPostDto extends PartialType(CreateDiaryPostDto) {}
