import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { TipsModule } from 'src/modules/tips/tips.module';
import { TipsService } from 'src/modules/tips/tips.service';
import { TipEntity } from 'src/modules/tips/entities/tip.entity';
import { MediaModule } from 'src/modules/media/media.module';
import { TipCommentsModule } from 'src/modules/tip-comments/tip-comments.module';
import { FollowsModule } from 'src/modules/follows/follows.module';
import { TipWordsModule } from 'src/modules/tip-words/tip-words.module';
import { CitiesModule } from 'src/modules/cities/cities.module';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';
import { TipClientDto } from 'src/modules/tips/dtos/tip-client.dto';

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

const tip: TipEntity = {
  id: 0,
  message: 'string',
  userId: 1,
  cityId: 0,
  createdAt: new Date(),
  user,
  tipMedias: [
    {
      id: 0,
      createdAt: new Date(),
      url: 'string',
      tipId: 0,
    },
  ],
  likedBy: [{ userId: 1, createdAt: new Date(), id: 2, tipId: 0 }],
  tags: null,
  commentsAmount: 666,
  softDelete: false,
  status: 'active',
  city: {
    id: 0,
    name: 'string',
    regionId: 0,
    latitude: 0,
    longitude: 0,
    region: {
      id: 0,
      name: 'string',
      countryId: 0,
      latitude: 0,
      longitude: 0,
      country: {
        id: 0,
        name: 'string',
        capital: 'string',
        iso2: 'string',
        latitude: 0,
        longitude: 0,
        continentId: 2,
      },
    },
  },
};

describe('tips service', () => {
  let service: TipsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TipsModule,
        MediaModule,
        TipCommentsModule,
        FollowsModule,
        TipWordsModule,
        CitiesModule,
        CityInterestsModule,
      ],
      providers: [TipsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(TipsService);
    prisma = module.get(PrismaService);
  });

  describe('procurar por id', () => {
    it('tip não existe', () => {
      prisma.tip.findUnique.mockResolvedValueOnce(null);

      expect(service.findUnique(2, currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('tip existe', () => {
      const mock: TipClientDto = {
        ...tip,
        likesAmount: 1,
        isLiked: true,
      };

      prisma.tip.findUnique.mockResolvedValueOnce(tip);
      prisma.tipComment.count.mockResolvedValueOnce(666);

      expect(service.findUnique(2, currentUser)).resolves.toStrictEqual(mock);
    });
  });

  describe('remover', () => {
    it('tip', () => {
      prisma.tip.findUnique.mockResolvedValueOnce(null);
      expect(service.delete(2, currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('usuário não é o criador do diário', () => {
      prisma.tip.findUnique.mockResolvedValueOnce(tip);
      expect(
        service.delete(2, { ...currentUser, id: 22 }),
      ).rejects.toThrowError(new UnauthorizedException());
    });

    it('removido com sucesso', () => {
      prisma.tip.findUnique.mockResolvedValueOnce(tip);
      expect(service.delete(2, currentUser)).resolves.not.toThrowError();
    });
  });

  describe('denunciar', () => {
    // it('tip tem menos que 7 denúncias', () => {
    //   prisma.tipReport.count.mockResolvedValueOnce(2);
    //   prisma.tip.findUnique.mockResolvedValueOnce(tip);

    //   expect(service.report(2, { reason: 'spam' }, currentUser));
    //   expect(prisma.tip.findUnique).not.toBeCalled();
    // });

    it('porcentagem insuficiente para mandar para admin', () => {
      const tipMock = {
        ...tip,
        user: { ...tip.user, followers: 10, following: 10 },
      };

      prisma.tipReport.create.mockResolvedValue({
        createdAt: new Date(),
        id: 2,
        userId: 2,
        reviewed: false,
        tipId: 2,
        reason: 'spam',
      });
      prisma.tipReport.count.mockResolvedValueOnce(666);
      prisma.tip.findUnique.mockResolvedValueOnce(tipMock);
      prisma.cityInterest.count.mockResolvedValueOnce(30);
      prisma.tipComment.count.mockResolvedValueOnce(10);
      prisma.tip.update.mockResolvedValueOnce(tipMock);

      expect(service.report(2, { reason: 'spam' }, currentUser));
      expect(prisma.tipReport.create).toHaveBeenCalled();
      expect(prisma.tipReport.count).toHaveReturnedWith(666);
    });
  });
});
