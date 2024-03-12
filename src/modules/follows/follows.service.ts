import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { FriendshipStatusDto } from 'src/modules/follows/dtos/friendship-status.dto';
import { FriendshipCountDto } from 'src/modules/follows/dtos/friendship-count.dto';

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(
    followingUsername: string,
    currentUser: UserFromJwt,
  ): Promise<void> {
    await this.prisma.follow.create({
      data: {
        following: {
          connect: {
            username: followingUsername,
          },
        },
        follower: {
          connect: {
            username: currentUser.username,
          },
        },
      },
    });
  }

  async unfollow(
    followingUsername: string,
    currentUser: UserFromJwt,
  ): Promise<void> {
    await this.prisma.follow.deleteMany({
      where: {
        following: {
          username: followingUsername,
        },
        follower: {
          username: currentUser.username,
        },
      },
    });
  }

  async friendshipStatus(
    followingUsername: string,
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
        following: {
          username: followingUsername,
        },
      },
    }));

    const followedBy = !!(await this.prisma.follow.count({
      where: {
        followingId: currentUser.id,
        follower: {
          username: followingUsername,
        },
      },
    }));

    return {
      isFollowing,
      followedBy,
    };
  }

  async friendshipCount(username: string): Promise<FriendshipCountDto> {
    const followers = await this.prisma.follow.count({
      where: { following: { username } },
    });
    const following = await this.prisma.follow.count({
      where: { follower: { username } },
    });

    return {
      followers,
      following,
    };
  }
}
