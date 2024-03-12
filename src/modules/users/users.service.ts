import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
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
import { UserClientDto } from './dtos/user-client.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { UserSearchDto } from 'src/modules/users/dtos/user-search.dto';
import { UserFullInfoDto } from 'src/modules/users/dtos/user-full-info.dto';
import { FollowsService } from 'src/modules/follows/follows.service';

interface JwtPayload {
  email: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly followsService: FollowsService,
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
            code: 'username-not-available',
          },
        }),
        ...(!!emailAlreadyExist && {
          email: {
            description: 'Email not available',
            code: 'email-not-available',
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
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByUsername(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<UserFullInfoDto> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        city: {
          include: {
            region: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return {
      ...user,
      ...(await this.followsService.friendshipCount(user.username)),
      friendshipStatus: await this.followsService.friendshipStatus(
        user.username,
        currentUser,
      ),
    };
  }

  async search(query: UserSearchDto): Promise<UserEntity[]> {
    return await this.prisma.$queryRaw<UserEntity[]>`
      DECLARE @page INT = ${query.page || 1};
      DECLARE @count INT = ${query.count || 10};

      SELECT *
      FROM [dbo].[User] as u
      WHERE CONTAINS(username, ${'"' + query.q + '*"'})
         OR CONTAINS(fullName, ${'"' + query.q + '*"'})
      ORDER BY u.id DESC
      OFFSET @count * (@page - 1) ROWS
      FETCH NEXT @count ROWS ONLY
    `;
  }

  async update(
    updateUserDto: UpdateUserDto,
    currentUser: UserFromJwt,
  ): Promise<UserFullInfoDto> {
    const data: Prisma.UserUpdateInput = {
      ...updateUserDto,
      password: updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : undefined,
    };

    const user = await this.prisma.user
      .update({
        data,
        where: { id: currentUser.id },
        include: {
          city: {
            include: {
              region: {
                include: {
                  country: true,
                },
              },
            },
          },
        },
      })
      .catch(() => {
        throw new ConflictException({
          username: {
            description: 'Username not available',
            code: 'username-not-available',
          },
        });
      });

    return {
      ...user,
      ...(await this.followsService.friendshipCount(currentUser.username)),
      friendshipStatus: {
        isFollowing: false,
        followedBy: false,
      },
    };
  }

  async delete(DeleteUserDto: DeleteUserDto, username: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

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

    if (!user) {
      throw new NotFoundException();
    }

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

    if (!user) {
      throw new NotFoundException();
    }

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

  async following(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<UserClientDto[]> {
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
          friendshipStatus: await this.followsService.friendshipStatus(
            user.username,
            currentUser,
          ),
        };
      }),
    );
  }

  async followers(
    username: string,
    currentUser?: UserFromJwt,
  ): Promise<UserClientDto[]> {
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
          friendshipStatus: await this.followsService.friendshipStatus(
            user.username,
            currentUser,
          ),
        };
      }),
    );
  }
}
