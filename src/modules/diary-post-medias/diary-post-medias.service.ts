import { Injectable } from '@nestjs/common';
import { CreateDiaryPostMediaDto } from './dto/create-diary-post-media.dto';
import { UpdateDiaryPostMediaDto } from './dto/update-diary-post-media.dto';

@Injectable()
export class DiaryPostMediasService {
  create(createDiaryPostMediaDto: CreateDiaryPostMediaDto) {
    return 'This action adds a new diaryPostMedia';
  }

  findAll() {
    return `This action returns all diaryPostMedias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diaryPostMedia`;
  }

  update(id: number, updateDiaryPostMediaDto: UpdateDiaryPostMediaDto) {
    return `This action updates a #${id} diaryPostMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} diaryPostMedia`;
  }
}
