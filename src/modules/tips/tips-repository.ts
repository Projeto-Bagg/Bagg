import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { Tip } from './entities/tip.entity';

export abstract class TipsRepository {
  abstract create(CreateTipDto: CreateTipDto): Promise<Tip>;
  abstract findMany(): Promise<Tip[]>;
  abstract findUnique(id: number): Promise<Tip>;
  abstract update(id: number, UpdateTipDto: UpdateTipDto): Promise<Tip>;
  abstract delete(id: number): Promise<Tip>;
}
