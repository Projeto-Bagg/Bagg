import { PartialType } from '@nestjs/swagger';
import { CreateDiaryPostLikeDto } from './create-diary-post-like.dto';

export class UpdateDiaryPostLikeDto extends PartialType(CreateDiaryPostLikeDto) {}
