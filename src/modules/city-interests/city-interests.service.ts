import { Injectable } from '@nestjs/common';
import { CreateCityInterestDto } from './dto/create-city-interest.dto';
import { UpdateCityInterestDto } from './dto/update-city-interest.dto';

@Injectable()
export class CityInterestsService {
  create(createCityInterestDto: CreateCityInterestDto) {
    return 'This action adds a new cityInterest';
  }

  findAll() {
    return `This action returns all cityInterests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cityInterest`;
  }

  update(id: number, updateCityInterestDto: UpdateCityInterestDto) {
    return `This action updates a #${id} cityInterest`;
  }

  remove(id: number) {
    return `This action removes a #${id} cityInterest`;
  }
}
