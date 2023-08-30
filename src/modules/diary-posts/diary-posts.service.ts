import { Injectable } from '@nestjs/common';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { UpdateDiaryPostDto } from './dto/update-diary-post.dto';

@Injectable()
export class DiaryPostsService {
  create(createDiaryPostDto: CreateDiaryPostDto) {
    return 'This action adds a new diaryPost';
  }

  findAll() {
    return `This action returns all diaryPosts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diaryPost`;
  }

  update(id: number, updateDiaryPostDto: UpdateDiaryPostDto) {
    return `This action updates a #${id} diaryPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} diaryPost`;
  }
}
