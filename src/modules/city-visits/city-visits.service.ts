import { Injectable } from '@nestjs/common';
import { CreateCityVisitDto } from './dto/create-city-visit.dto';
import { UpdateCityVisitDto } from './dto/update-city-visit.dto';

@Injectable()
export class CityVisitsService {
  create(createCityVisitDto: CreateCityVisitDto) {
    return 'This action adds a new cityVisit';
  }

  findAll() {
    return `This action returns all cityVisits`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cityVisit`;
  }

  update(id: number, updateCityVisitDto: UpdateCityVisitDto) {
    return `This action updates a #${id} cityVisit`;
  }

  remove(id: number) {
    return `This action removes a #${id} cityVisit`;
  }
}
