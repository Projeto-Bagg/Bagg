import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { UpdateDiaryPostDto } from './dto/update-diary-post.dto';
import { DiaryPost } from './entities/diary-post.entity';

export abstract class DiaryPostsRepository {
  abstract create(CreateTipDto: CreateDiaryPostDto): Promise<DiaryPost>;
  abstract findMany(): Promise<DiaryPost[]>;
  abstract findUnique(id: number): Promise<DiaryPost>;
  abstract update(
    id: number,
    UpdateDiaryPostDto: UpdateDiaryPostDto,
  ): Promise<DiaryPost>;
  abstract delete(id: number): Promise<DiaryPost>;
}
