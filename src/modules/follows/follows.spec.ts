import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { FollowsService } from 'src/modules/follows/follows.service';
import { FollowsModule } from 'src/modules/follows/follows.module';

const currentUser: UserFromJwt = {
  id: 1,
  hasEmailBeenVerified: true,
  role: 'USER',
};

describe('tip comments service', () => {
  let service: FollowsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FollowsModule],
      providers: [FollowsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(FollowsService);
    prisma = module.get(PrismaService);
  });

  describe('status de amizade', () => {
    it('usuário deslogado', () => {
      expect(service.friendshipStatus(2)).resolves.toStrictEqual({
        followedBy: false,
        isFollowing: false,
      });
    });

    it('usuário logado', () => {
      prisma.follow.count.mockResolvedValueOnce(1);
      prisma.follow.count.mockResolvedValueOnce(0);

      expect(service.friendshipStatus(2, currentUser)).resolves.toStrictEqual({
        isFollowing: true,
        followedBy: false,
      });
    });
  });
});
