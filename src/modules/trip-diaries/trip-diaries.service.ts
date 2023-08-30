import { Injectable } from '@nestjs/common';
import { CreateTripDiaryDto } from './dto/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dto/update-trip-diary.dto';

@Injectable()
export class TripDiariesService {
  create(createTripDiaryDto: CreateTripDiaryDto) {
    return 'This action adds a new tripDiary';
  }

  findAll() {
    return `This action returns all tripDiaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tripDiary`;
  }

  update(id: number, updateTripDiaryDto: UpdateTripDiaryDto) {
    return `This action updates a #${id} tripDiary`;
  }

  remove(id: number) {
    return `This action removes a #${id} tripDiary`;
  }
}
