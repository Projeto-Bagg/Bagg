import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { FriendshipStatusDto } from 'src/modules/follows/dtos/friendship-status.dto';
import { FriendshipCountDto } from 'src/modules/follows/dtos/friendship-count.dto';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followingId: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.follow.create({
      data: {
        following: {
          connect: {
            id: followingId,
          },
        },
        follower: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
  }

  async unfollow(followingId: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.follow.deleteMany({
      where: {
        followingId,
        followerId: currentUser.id,
      },
    });
  }

  async friendshipStatus(
    followingId: number,
    currentUser?: UserFromJwt,
  ): Promise<FriendshipStatusDto> {
    if (!currentUser) {
      return {
        followedBy: false,
        isFollowing: false,
      };
    }

    const isFollowing = !!(await this.prisma.follow.count({
      where: {
        followerId: currentUser.id,
        followingId,
      },
    }));

    const followedBy = !!(await this.prisma.follow.count({
      where: {
        followingId: currentUser.id,
        followerId: followingId,
      },
    }));

    return {
      isFollowing,
      followedBy,
    };
  }

  async friendshipCount(id: number): Promise<FriendshipCountDto> {
    const followers = await this.prisma.follow.count({
      where: { id },
    });
    const following = await this.prisma.follow.count({
      where: { id },
    });

    return {
      followers,
      following,
    };
  }
}
