import { Injectable } from '@nestjs/common';
import { CreateTipMediaDto } from './dto/create-tip-media.dto';
import { UpdateTipMediaDto } from './dto/update-tip-media.dto';

@Injectable()
export class TipMediasService {
  create(createTipMediaDto: CreateTipMediaDto) {
    return 'This action adds a new tipMedia';
  }

  findAll() {
    return `This action returns all tipMedias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipMedia`;
  }

  update(id: number, updateTipMediaDto: UpdateTipMediaDto) {
    return `This action updates a #${id} tipMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipMedia`;
  }
}
