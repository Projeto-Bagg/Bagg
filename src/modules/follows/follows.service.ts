import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { FollowsRepository } from './follows-repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowsService implements FollowsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createFollowDto: CreateFollowDto) {
    return this.prisma.follows.create({
      data: {
        followerId: createFollowDto.followerId,
        followingId: createFollowDto.followingId,
      },
    });
  }

  findMany() {
    return this.prisma.follows.findMany();
  }

  findUnique(id: number) {
    return this.prisma.follows.findUnique({ where: { id } });
  }

  update(id: number, UpdateFollowDto: UpdateFollowDto) {
    return this.prisma.follows.update({ where: { id }, data: UpdateFollowDto });
  }

  delete(id: number) {
    return this.prisma.follows.delete({ where: { id } });
  }
}
