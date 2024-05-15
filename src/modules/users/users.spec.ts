import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { FollowsModule } from 'src/modules/follows/follows.module';
import { EmailsModule } from '../emails/emails.module';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { UserFullInfoDto } from 'src/modules/users/dtos/user-full-info.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

const user: UserEntity = {
  accountId: 1,
  id: 1,
  birthdate: new Date(),
  createdAt: new Date(),
  fullName: 'User',
  username: 'User',
  emailVerified: false,
  bio: '',
  cityId: null,
  image: null,
};

const currentUser: UserFromJwt = {
  id: 1,
  hasEmailBeenVerified: true,
  role: 'USER',
};

const fullInfoUser: UserFullInfoDto = {
  ...user,
  city: null,
  followers: 1,
  following: 2,
  friendshipStatus: {
    followedBy: false,
    isFollowing: false,
  },
};

describe('user service', () => {
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule, FollowsModule, EmailsModule],
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(UsersService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('email ou nome de usuário já cadastrado', () => {
      prisma.account.count.mockResolvedValueOnce(1);
      prisma.user.count.mockResolvedValueOnce(1);

      expect(
        service.create({
          username: 'teste',
          birthdate: new Date(),
          email: 'teste@gmail.com',
          fullName: 'teste',
          password: 'teste',
        }),
      ).rejects.toThrowError(
        new ConflictException({
          username: {
            description: 'Username not available',
            code: 'username-not-available',
          },
          email: {
            description: 'Email not available',
            code: 'email-not-available',
          },
        }),
      );
    });

    it('cadastro com sucesso', () => {
      const user: CreateUserDto = {
        username: 'teste',
        birthdate: new Date(),
        email: 'teste@gmail.com',
        fullName: 'teste',
        password: 'teste',
      };

      prisma.account.count.mockResolvedValueOnce(0);
      prisma.user.count.mockResolvedValueOnce(0);

      prisma.account.create.mockResolvedValueOnce({
        id: 1,
        active: true,
        email: user.email,
        password: user.password,
      });

      expect(service.create(user)).resolves.not.toThrowError();
    });
  });

  describe('findByEmail', () => {
    it('returns user', () => {
      prisma.user.findFirst.mockResolvedValueOnce(user);

      expect(service.findByEmail('teste@gmail.com')).resolves.toBe(user);
    });

    it('usuário não encontrado', () => {
      prisma.user.findFirst.mockResolvedValueOnce(null);

      expect(service.findByEmail('teste@gmail.com')).rejects.toThrowError(
        new NotFoundException(),
      );
    });
  });

  describe('findById', () => {
    it('returns user', () => {
      prisma.user.findUnique.mockResolvedValueOnce(user);

      expect(service.findById(1)).resolves.toBe(user);
    });

    it('usuário não encontrado', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(service.findById(1)).rejects.toThrowError(new NotFoundException());
    });
  });

  describe('fullInfoUserById', () => {
    it('returns user', () => {
      const mock = { ...user, city: null };

      prisma.user.findUnique.mockResolvedValueOnce(mock);
      prisma.follow.count.mockResolvedValueOnce(1);
      prisma.follow.count.mockResolvedValueOnce(2);
      prisma.follow.count.mockResolvedValueOnce(0);
      prisma.follow.count.mockResolvedValueOnce(0);

      expect(service.fullInfoUserById(1, currentUser)).resolves.toStrictEqual(
        fullInfoUser,
      );
    });

    it('usuário não encontrado', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(service.fullInfoUserById(1, currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });
  });

  describe('findByUsername', () => {
    it('returns user', () => {
      const mock = { ...user, city: null };

      prisma.user.findUnique.mockResolvedValueOnce(mock);
      prisma.follow.count.mockResolvedValueOnce(1);
      prisma.follow.count.mockResolvedValueOnce(2);
      prisma.follow.count.mockResolvedValueOnce(0);
      prisma.follow.count.mockResolvedValueOnce(0);

      expect(
        service.findByUsername('teste', currentUser),
      ).resolves.toStrictEqual(fullInfoUser);
    });

    it('usuário não encontrado', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(service.findByUsername('teste', currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });
  });

  describe('findByCity', () => {
    it('return users', () => {
      const users: UserEntity[] = [user];

      prisma.user.findMany.mockResolvedValueOnce(users);

      expect(service.findByCity({ cityId: 2 })).resolves.toStrictEqual(
        users.map((user) => {
          return {
            ...user,
            friendshipStatus: {
              isFollowing: false,
              followedBy: false,
            },
          };
        }),
      );
    });
  });

  describe('city', () => {
    it('getResidentsCountByCityId', () => {
      prisma.user.count.mockResolvedValueOnce(2);
      expect(service.getResidentsCountByCityId(2)).resolves.toEqual(2);
    });

    it('findByCity', () => {
      const users: UserEntity[] = [user];

      prisma.user.findMany.mockResolvedValueOnce(users);

      expect(service.findByCity({ cityId: 15571 })).resolves.toEqual(
        users.map((user) => {
          return {
            ...user,
            friendshipStatus: {
              isFollowing: false,
              followedBy: false,
            },
          };
        }),
      );
    });
  });

  describe('country', () => {
    it('getResidentsCountByIso2', () => {
      prisma.user.count.mockResolvedValueOnce(2);

      expect(service.getResidentsCountByIso2('BR')).resolves.toEqual(2);
    });

    it('findByCountry', () => {
      const users: UserEntity[] = [user];

      prisma.user.findMany.mockResolvedValueOnce(users);

      expect(service.findByCountry({ countryIso2: 'BR' })).resolves.toEqual(
        users.map((user) => {
          return {
            ...user,
            friendshipStatus: {
              isFollowing: false,
              followedBy: false,
            },
          };
        }),
      );
    });
  });

  describe('username availability', () => {
    it('available', () => {
      prisma.user.count.mockResolvedValueOnce(0);
      expect(service.isUsernameAvailable('teste')).resolves.toEqual(true);
    });

    it('not available', () => {
      prisma.user.count.mockResolvedValueOnce(1);
      expect(service.isUsernameAvailable('teste')).resolves.toEqual(false);
    });
  });

  describe('email availability', () => {
    it('available', () => {
      prisma.user.count.mockResolvedValueOnce(0);
      expect(service.isEmailAvailable('teste@gmail.com')).resolves.toEqual(
        true,
      );
    });

    it('not available', () => {
      prisma.user.count.mockResolvedValueOnce(1);
      expect(service.isEmailAvailable('teste@gmail.com')).resolves.toEqual(
        false,
      );
    });
  });

  describe('update username', () => {
    it('username available', () => {
      prisma.user.count.mockResolvedValueOnce(0);

      expect(
        service.updateUsername('teste', currentUser),
      ).resolves.not.toThrowError();

      // expect(prisma.user.update).toBeCalledWith({
      //   data: {
      //     username: 'teste',
      //   },
      //   where: {
      //     id: currentUser.id,
      //   },
      // });
    });

    it('not available', () => {
      prisma.user.count.mockResolvedValueOnce(1);
      expect(service.updateUsername('teste', currentUser)).rejects.toThrowError(
        new ConflictException('Username not available'),
      );
    });
  });

  it('update user', () => {
    const mock = { ...user, city: null };

    prisma.user.update.mockResolvedValueOnce(mock);
    prisma.follow.count.mockResolvedValueOnce(1);
    prisma.follow.count.mockResolvedValueOnce(2);

    expect(
      service.update({ fullName: 'novo nome' }, currentUser),
    ).resolves.toEqual(fullInfoUser);
  });

  describe('delete user', () => {
    it('conta não existe', () => {
      prisma.account.findUnique.mockResolvedValueOnce(null);

      expect(
        service.delete({ currentPassword: 'teste' }, currentUser),
      ).rejects.toThrowError(new NotFoundException());
    });

    it('senha incorreta', () => {
      prisma.account.findUnique.mockResolvedValueOnce({
        email: 'teste@gmail.com',
        id: 1,
        password:
          '$2a$10$AwWEFu52Grrci4pZ7t0aHOKwE15CQILe.YTDqmUn1n0Iv7vEmGQiy', // teste
        active: true,
      });

      expect(
        service.delete({ currentPassword: 'teste2' }, currentUser),
      ).rejects.toThrowError(new ForbiddenException('Wrong password'));
    });
  });

  it('deletado com sucesso', () => {
    prisma.account.findUnique.mockResolvedValueOnce({
      email: 'teste@gmail.com',
      id: 1,
      password: '$2a$10$AwWEFu52Grrci4pZ7t0aHOKwE15CQILe.YTDqmUn1n0Iv7vEmGQiy', // teste
      active: true,
    });

    expect(
      service.delete({ currentPassword: 'teste' }, currentUser),
    ).resolves.not.toThrowError();
  });

  describe('update password', () => {
    it('conta não existe', () => {
      prisma.account.findUnique.mockResolvedValueOnce(null);

      expect(
        service.updatePassword(
          { currentPassword: 'teste', newPassword: 'novasenha' },
          currentUser,
        ),
      ).rejects.toThrowError(new NotFoundException());
    });

    it('senha incorreta', () => {
      prisma.account.findUnique.mockResolvedValueOnce({
        email: 'teste@gmail.com',
        id: 1,
        password:
          '$2a$10$AwWEFu52Grrci4pZ7t0aHOKwE15CQILe.YTDqmUn1n0Iv7vEmGQiy', // teste
        active: true,
      });

      expect(
        service.updatePassword(
          { currentPassword: 'teste2', newPassword: 'novasenha' },
          currentUser,
        ),
      ).rejects.toThrowError(new ForbiddenException('Wrong password'));
    });
  });

  it('deletado com sucesso', () => {
    prisma.account.findUnique.mockResolvedValueOnce({
      email: 'teste@gmail.com',
      id: 1,
      password: '$2a$10$AwWEFu52Grrci4pZ7t0aHOKwE15CQILe.YTDqmUn1n0Iv7vEmGQiy', // teste
      active: true,
    });

    expect(
      service.updatePassword(
        { currentPassword: 'teste', newPassword: 'novasenha' },
        currentUser,
      ),
    ).resolves.not.toThrowError();
  });

  describe('email verificado', () => {
    it('conta não existe', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(service.isEmailVerified(currentUser)).rejects.toThrowError(
        new NotFoundException(
          'No account has been registered with the given id',
        ),
      );
    });

    it('email não verificado', () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        ...user,
        emailVerified: false,
      });

      expect(service.isEmailVerified(currentUser)).rejects.toThrowError(
        new BadRequestException("Email hasn't already been verified"),
      );
    });

    it('email verificado', () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        ...user,
        emailVerified: true,
      });

      expect(service.isEmailVerified(currentUser)).resolves.not.toThrowError();
    });
  });

  describe('confirmação de email', () => {
    it('conta não existe', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(service.sendConfirmationEmail(currentUser)).rejects.toThrowError(
        new NotFoundException(
          'No account has been registered with the given id',
        ),
      );
    });

    it('email não verificado', () => {
      prisma.user.findUnique.mockResolvedValueOnce({
        ...user,
        emailVerified: true,
      });

      expect(service.sendConfirmationEmail(currentUser)).rejects.toThrowError(
        new BadRequestException('Email has already been verified'),
      );
    });

    it('confirmação de email enviada', () => {
      const mock = {
        ...user,
        account: {
          email: 'felipebrito2077@gmail.com',
        },
        emailVerified: false,
      };

      prisma.user.findUnique.mockResolvedValueOnce(mock);

      expect(
        service.sendConfirmationEmail(currentUser),
      ).resolves.not.toThrowError();
    });

    it('verificar confirmação de email com sucesso', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIn0.bYx6y6N1Pth3ivNX_6259gYhC0E9PcP7jD_s1BEmB3Y';

      expect(
        service.verifyEmailConfirmation(token),
      ).resolves.not.toThrowError();
    });

    it('verificar confirmação de email com erro no token', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVIiOiIxIn0.rTCH8cLoGxAm_xw68z-zXVKi9ie6xJn9tnVWjd_9ftE';

      expect(service.verifyEmailConfirmation(token)).rejects.toThrowError(
        new BadRequestException('Invalid token'),
      );
    });
  });

  describe('reset de senha por email', () => {
    it('conta não existe', () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(
        service.sendPasswordReset('felipebrito2077@gmail.com'),
      ).rejects.toThrowError(
        new NotFoundException(
          'No account has been registered with the given email',
        ),
      );
    });

    it('email enviado', () => {
      prisma.account.findUnique.mockResolvedValueOnce({
        active: true,
        email: 'felipebrito2077@gmail.com',
        id: 1,
        password: 'teste',
      });

      expect(
        service.sendPasswordReset('felipebrito2077@gmail.com'),
      ).resolves.not.toThrowError();
    });

    it('alterar senha com sucesso', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlQGdtYWlsLmNvbSJ9.GGYWI-M1hyVkIwahynfdr1uAvcdeAl3gQna-rvbcsac';

      expect(service.resetPassword(token, 'teste')).resolves.not.toThrowError();
    });

    it('alterar senha com erro', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkInRlc3RlQGdtYWlsLmNvbSJ9.GGYWI-M1hyVkIwahynfdr1uAvcdeAl3gQna-rvbcsac';

      expect(service.resetPassword(token, 'teste')).rejects.toThrowError(
        new BadRequestException('Invalid token'),
      );
    });
  });
});
