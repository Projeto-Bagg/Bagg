import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { TripDiariesService } from 'src/modules/trip-diaries/trip-diaries.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TipCommentsService } from 'src/modules/tip-comments/tip-comments.service';
import { TipCommentsModule } from 'src/modules/tip-comments/tip-comments.module';
import { TipCommentEntity } from 'src/modules/tip-comments/entities/tip-comment.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';

const currentUser: UserFromJwt = {
  id: 1,
  hasEmailBeenVerified: true,
  role: 'USER',
};

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

const comment: TipCommentEntity = {
  createdAt: new Date(),
  id: 2,
  message: 'message',
  softDelete: false,
  status: 'active',
  tipId: 2,
  user: {
    ...user,
    id: 666,
  },
  userId: 666,
};

describe('tip comments service', () => {
  let service: TipCommentsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TipCommentsModule, CityInterestsModule],
      providers: [TipCommentsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(TipCommentsService);
    prisma = module.get(PrismaService);
  });

  it('criar comentário', () => {
    const comment: TipCommentEntity = {
      message: 'message',
      tipId: 1,
      createdAt: new Date(),
      id: 1,
      softDelete: false,
      status: 'active',
      user,
      userId: user.id,
    };

    prisma.tipComment.create.mockResolvedValueOnce(comment);

    expect(
      service.create(
        { message: comment.message, tipId: comment.tipId },
        currentUser,
      ),
    ).resolves.not.toThrowError();
  });

  it('procurar por tipId', () => {
    const comment: TipCommentEntity = {
      message: 'message',
      tipId: 1,
      createdAt: new Date(),
      id: 1,
      softDelete: false,
      status: 'active',
      user,
      userId: user.id,
    };

    prisma.tipComment.findMany.mockResolvedValueOnce([comment]);

    expect(service.findByTip(2)).resolves.not.toThrowError();
  });

  it('quantidade de comentários em tip', () => {
    prisma.tipComment.count.mockResolvedValueOnce(33);

    expect(service.getTipCommentsAmount(2)).resolves.toStrictEqual(33);
  });

  describe('deletar', () => {
    it('comentário não existe', () => {
      prisma.tipComment.findUnique.mockResolvedValueOnce(null);

      expect(service.delete(2, currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('usuário não criou o comentário', () => {
      prisma.tipComment.findUnique.mockResolvedValueOnce(comment);

      expect(service.delete(2, currentUser)).rejects.toThrowError(
        new UnauthorizedException(),
      );
    });

    it('comentário deletado', () => {
      prisma.tipComment.findUnique.mockResolvedValueOnce(comment);

      expect(
        service.delete(2, { ...currentUser, id: 666 }),
      ).resolves.not.toThrowError();
    });
  });
});
