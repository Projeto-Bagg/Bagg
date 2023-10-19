import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { UserClient } from './entities/user-client.entity';
import { FriendshipStatusDto } from 'src/modules/users/dtos/friendship-status.dto';
import { FriendshipCountDto } from 'src/modules/users/dtos/friendship-count.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

interface JwtPayload {
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const emailAlreadyExist = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    const usernameAlreadyExist = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });

    if (!!emailAlreadyExist || !!usernameAlreadyExist) {
      throw new ConflictException({
        ...(!!usernameAlreadyExist && {
          username: {
            description: 'Username not available',
            code: 'usernameNotAvailable',
          },
        }),
        ...(!!emailAlreadyExist && {
          email: {
            description: 'Email not available',
            code: 'emailNotAvailable',
          },
        }),
      });
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    await this.prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByUsername(username: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async update(
    updateUserDto: UpdateUserDto,
    username: string,
  ): Promise<UserClient> {
    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      password: updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : undefined,
    };

    const user = await this.prisma.user
      .update({
        data,
        where: { username },
      })
      .catch(() => {
        throw new ConflictException({
          username: {
            description: 'Username not available',
            code: 'usernameNotAvailable',
          },
        });
      });

    return {
      ...user,
      ...(await this.friendshipCount(username)),
      ...{
        isFollowing: false,
        followedBy: false,
      },
    };
  }

  async delete(DeleteUserDto: DeleteUserDto, username: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    const validPassword = await bcrypt.compare(
      DeleteUserDto.currentPassword,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    await this.prisma.user.delete({ where: { username } });
  }

  async updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    username: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    const validPassword = await bcrypt.compare(
      UpdatePasswordDto.currentPassword,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    const password = await bcrypt.hash(UpdatePasswordDto.newPassword, 10);

    await this.prisma.user.update({ data: { password }, where: { username } });
  }

  async sendConfirmationEmail(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user.emailVerified) {
      //usar alguma biblioteca de template para passar o token para o html que vai ter no email
      const verificationToken = this.jwt.sign({
        email: user.email,
      });
      //precisa permitir que apps menos seguros usem seu gmail por conta da falta do oauth, se não não vai funcionar
      const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailDetails = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'pretty subject',
        text: 'pretty text',
      };

      mailTransporter.sendMail(mailDetails, function (err) {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
    return true;
  }

  async verifyConfirmationEmail(token: string): Promise<boolean> {
    const decoded = this.jwt.decode(token) as JwtPayload;

    await this.prisma.user.update({
      data: { emailVerified: true },
      where: { email: decoded.email },
    });

    return true;
  }

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
    currentUser: UserFromJwt,
  ): Promise<FriendshipStatusDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: followingUsername,
      },
      select: {
        followers: true,
        following: true,
      },
    });

    return {
      isFollowing: user.followers.some(
        (follower) => follower.followerId === currentUser.id,
      ),
      followedBy: user.following.some(
        (following) => following.followingId === currentUser.id,
      ),
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

  async following(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<UserClient[]> {
    const users = await this.prisma.user.findMany({
      where: {
        followers: {
          some: {
            follower: {
              username,
            },
          },
        },
      },
    });

    return await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          ...(currentUser
            ? await this.friendshipStatus(user.username, currentUser)
            : {
                isFollowing: false,
                followedBy: false,
              }),
          ...(await this.friendshipCount(user.username)),
        };
      }),
    );
  }

  async followers(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<UserClient[]> {
    const users = await this.prisma.user.findMany({
      where: {
        following: {
          some: {
            following: {
              username,
            },
          },
        },
      },
    });

    return await Promise.all(
      users.map(async (user) => {
        return {
          ...user,
          ...(currentUser
            ? await this.friendshipStatus(user.username, currentUser)
            : {
                isFollowing: false,
                followedBy: false,
              }),
          ...(await this.friendshipCount(user.username)),
        };
      }),
    );
  }
}
