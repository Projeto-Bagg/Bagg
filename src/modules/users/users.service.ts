import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserClientDto } from './dtos/user-client.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { UserSearchDto } from './dtos/user-search.dto';
import { UserFullInfoDto } from './dtos/user-full-info.dto';
import { FollowsService } from '../follows/follows.service';
import { FindUserByCityDto } from './dtos/find-user-by-city.dto';
import { FindUserByCountryDto } from './dtos/find-user-by-country.dto';
import { EmailsService } from '../emails/emails-service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly followsService: FollowsService,
    private readonly emailsService: EmailsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const emailAlreadyExist = await this.prisma.account.count({
      where: { email: createUserDto.email },
    });

    const usernameAlreadyExist = await this.prisma.user.count({
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

    const account = await this.prisma.account.create({
      data: {
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });

    await this.prisma.user.create({
      data: {
        id: account.id,
        birthdate: createUserDto.birthdate,
        fullName: createUserDto.fullName,
        username: createUserDto.username,
        account: {
          connect: { id: account.id },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: { account: { email } },
    });

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

  async fullInfoUserById(
    id: number,
    currentUser?: UserFromJwt,
  ): Promise<UserFullInfoDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
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
      ...(await this.followsService.friendshipCount(user.id)),
      friendshipStatus: await this.followsService.friendshipStatus(
        user.id,
        currentUser,
      ),
    };
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
      ...(await this.followsService.friendshipCount(user.id)),
      friendshipStatus: await this.followsService.friendshipStatus(
        user.id,
        currentUser,
      ),
    };
  }

  async findByCity(
    { cityId, count = 10, page = 1 }: FindUserByCityDto,
    currentUser?: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        cityId,
      },
      skip: count * (page - 1),
      take: count,
    });

    return await Promise.all(
      users.map(async (user) => {
        const friendshipStatus = await this.followsService.friendshipStatus(
          user.id,
          currentUser,
        );

        return {
          ...user,
          friendshipStatus,
        };
      }),
    );
  }

  getResidentsCountByCityId(cityId: number): Promise<number> {
    return this.prisma.user.count({
      where: {
        cityId,
      },
    });
  }

  async findByCountry(
    { countryIso2, count = 10, page = 1 }: FindUserByCountryDto,
    currentUser?: UserFromJwt,
  ): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: {
        city: {
          region: {
            country: {
              iso2: countryIso2,
            },
          },
        },
      },
      skip: count * (page - 1),
      take: count,
    });

    return await Promise.all(
      users.map(async (user) => {
        const friendshipStatus = await this.followsService.friendshipStatus(
          user.id,
          currentUser,
        );

        return {
          ...user,
          friendshipStatus,
        };
      }),
    );
  }

  getResidentsCountByIso2(countryIso2: string): Promise<number> {
    return this.prisma.user.count({
      where: {
        city: {
          region: {
            country: {
              iso2: countryIso2,
            },
          },
        },
      },
    });
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    return !!!(await this.prisma.user.count({
      where: {
        username,
      },
    }));
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return !!!(await this.prisma.user.count({
      where: {
        account: {
          email,
        },
      },
    }));
  }

  async updateUsername(username, currentUser: UserFromJwt): Promise<void> {
    const isUsernameAvailable = await this.isUsernameAvailable(username);

    if (!isUsernameAvailable) {
      throw new ConflictException('Username not available');
    }

    await this.prisma.user.update({
      data: {
        username,
      },
      where: {
        id: currentUser.id,
      },
    });
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
      bio: updateUserDto.bio,
      birthdate: updateUserDto.birthdate,
      city: {
        connect: {
          id: updateUserDto.cityId,
        },
      },
      fullName: updateUserDto.fullName,
      image: updateUserDto.image,
    };

    const user = await this.prisma.user.update({
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
    });

    return {
      ...user,
      ...(await this.followsService.friendshipCount(currentUser.id)),
      friendshipStatus: {
        isFollowing: false,
        followedBy: false,
      },
    };
  }

  async delete(
    DeleteUserDto: DeleteUserDto,
    currentUser: UserFromJwt,
  ): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: currentUser.id },
    });

    if (!account) {
      throw new NotFoundException();
    }

    const validPassword = await bcrypt.compare(
      DeleteUserDto.currentPassword,
      account.password,
    );

    if (!validPassword) {
      throw new ForbiddenException('Wrong password');
    }

    await this.prisma.tip.deleteMany({ where: { userId: currentUser.id } });

    await this.prisma.diaryPost.deleteMany({
      where: { userId: currentUser.id },
    });

    await this.prisma.cityInterest.deleteMany({
      where: { userId: currentUser.id },
    });

    await this.prisma.tipLike.deleteMany({ where: { userId: currentUser.id } });

    await this.prisma.cityVisit.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });

    await this.prisma.follow.deleteMany({
      where: {
        OR: [{ followingId: currentUser.id }, { followerId: currentUser.id }],
      },
    });

    await this.prisma.account.delete({ where: { id: currentUser.id } });
  }

  async updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    currentUser: UserFromJwt,
  ): Promise<void> {
    const account = await this.prisma.account.findUnique({
      where: { id: currentUser.id },
    });

    if (!account) {
      throw new NotFoundException();
    }

    const validPassword = await bcrypt.compare(
      UpdatePasswordDto.currentPassword,
      account.password,
    );

    if (!validPassword) {
      throw new ConflictException('Wrong password');
    }

    const password = await bcrypt.hash(UpdatePasswordDto.newPassword, 10);

    await this.prisma.account.update({
      data: { password },
      where: { id: currentUser.id },
    });
  }

  async isEmailVerified(currentUser: UserFromJwt): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
    });

    if (!user) {
      throw new NotFoundException(
        'No account has been registered with the given id',
      );
    }

    if (!user.emailVerified) {
      throw new BadRequestException("Email hasn't already been verified");
    }
  }

  async sendConfirmationEmail(currentUser: UserFromJwt) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      include: {
        account: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'No account has been registered with the given id',
      );
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email has already been verified');
    }
    //usar alguma biblioteca de template para passar o token para o html que vai ter no email
    const verificationToken = await this.jwt.signAsync(
      {
        email: user.account.email,
        sub: user.id,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '1h',
      },
    );
    const verificationUrl =
      process.env.BAGG_WEBSITE_URL +
      '/settings/verify-email/verify/?token=' +
      verificationToken;
    return await this.emailsService.sendMail(
      user.account.email,
      'Confirme seu Email!',
      verificationUrl,
    );
  }

  async sendPasswordReset(email: string) {
    const account = await this.prisma.account.findUnique({ where: { email } });

    if (!account) {
      throw new NotFoundException(
        'No account has been registered with the given email',
      );
    }

    //usar alguma biblioteca de template para passar o token para o html que vai ter no email
    const verificationToken = await this.jwt.signAsync(
      {
        email: account.email,
      },
      {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: '1h',
      },
    );

    const resetUrl =
      process.env.BAGG_WEBSITE_URL +
      '/settings/reset-password/reset?token=' +
      verificationToken;
    return await this.emailsService.sendMail(
      account.email,
      'Renove sua senha!',
      resetUrl,
    );
  }

  async verifyEmailConfirmation(token: string): Promise<boolean> {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      await this.prisma.user.update({
        data: { emailVerified: true },
        where: { id: decoded.sub },
      });

      return true;
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      await this.prisma.account.update({
        data: { password: await bcrypt.hash(password, 10) },
        where: { email: decoded.email },
      });
      //mandar um email por seguranca q a senha do usuario foi trocada
    } catch (e) {
      throw new BadRequestException('Invalid token');
    }
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
            user.id,
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
            user.id,
            currentUser,
          ),
        };
      }),
    );
  }
}
