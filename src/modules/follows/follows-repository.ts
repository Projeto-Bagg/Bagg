import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Follow } from './entities/follow.entity';

export abstract class FollowsRepository {
  abstract create(CreateFollowDto: CreateFollowDto): Promise<Follow>;
  abstract findMany(): Promise<Follow[]>;
  abstract findUnique(id: number): Promise<Follow>;
  abstract update(
    id: number,
    UpdateFollowDto: UpdateFollowDto,
  ): Promise<Follow>;
  abstract delete(id: number): Promise<Follow>;
}
