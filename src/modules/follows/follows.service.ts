import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFollowDto: CreateFollowDto) {
    return this.prisma.follow.create({
      data: {
        followerId: createFollowDto.followerId,
        followingId: createFollowDto.followingId,
      },
    });
  }

  findMany() {
    return this.prisma.follow.findMany();
  }

  findUnique(id: number) {
    return this.prisma.follow.findUnique({ where: { id } });
  }

  update(id: number, UpdateFollowDto: UpdateFollowDto) {
    return this.prisma.follow.update({ where: { id }, data: UpdateFollowDto });
  }

  delete(id: number) {
    return this.prisma.follow.delete({ where: { id } });
  }
}
