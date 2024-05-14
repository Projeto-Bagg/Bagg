import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { FollowsModule } from '../follows/follows.module';
import { EmailsModule } from 'src/modules/emails/emails.module';

describe('UserService', () => {
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

  it('returns users', () => {
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

    prisma.user.findUnique.mockResolvedValueOnce(user);

    expect(service.findById(1)).resolves.toBe(user);
  });
});
