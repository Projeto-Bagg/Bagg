import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { TripDiariesService } from 'src/modules/trip-diaries/trip-diaries.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CreateTripDiaryDto } from 'src/modules/trip-diaries/dtos/create-trip-diary.dto';
import { TripDiariesModule } from 'src/modules/trip-diaries/trip-diaries.module';
import { TripDiaryClientDto } from 'src/modules/trip-diaries/dtos/trip-diary-client.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

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

const tripDiaries: TripDiaryClientDto[] = [
  {
    id: 1,
    title: 'title',
    message: 'message',
    userId: 1,
    createdAt: new Date(),
    cityId: 1,
    city: {
      id: 0,
      name: 'São Paulo',
      regionId: 1,
      latitude: 1,
      longitude: 2,
      region: {
        id: 1,
        name: 'São Paulo',
        countryId: 1,
        latitude: 3,
        longitude: 2,
        country: {
          id: 2,
          name: 'Brazil',
          capital: 'Brasília',
          iso2: 'BR',
          latitude: 6,
          longitude: 5,
          continentId: 2,
        },
      },
    },
    user: user,
    postsAmount: 55,
  },
];

const diaryPosts: DiaryPostEntity[] = [
  {
    id: 0,
    message: 'string',
    userId: 0,
    user: {
      id: 0,
      fullName: 'string',
      username: 'string',
      bio: 'string',
      birthdate: new Date(),
      image: 'string',
      cityId: 0,
      accountId: 0,
      createdAt: new Date(),
      emailVerified: true,
    },
    createdAt: new Date(),
    tripDiaryId: 0,
    tripDiary: {
      id: 0,
      title: 'string',
      message: 'string',
      userId: 0,
      createdAt: new Date(),
      cityId: 0,
    },
    likedBy: [
      { createdAt: new Date(), diaryPostId: 1, id: 1, userId: 1 },
      { createdAt: new Date(), diaryPostId: 1, id: 2, userId: 2 },
    ],
    softDelete: false,
    status: 'active',
    diaryPostMedias: [
      {
        id: 0,
        createdAt: new Date(),
        url: 'string',
        diaryPostId: 0,
      },
    ],
  },
];

describe('trip diaries service', () => {
  let service: TripDiariesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TripDiariesModule],
      providers: [TripDiariesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(TripDiariesService);
    prisma = module.get(PrismaService);
  });

  it('criar diário de viagem', () => {
    const createTripDiary: CreateTripDiaryDto = {
      cityId: 1,
      message: 'message',
      title: 'title',
    };

    const mock = {
      ...createTripDiary,
      id: 1,
      createdAt: new Date(),
      userId: currentUser.id,
    };

    prisma.tripDiary.create.mockResolvedValueOnce(mock);

    expect(service.create(createTripDiary, currentUser)).resolves.toStrictEqual(
      { ...mock, postsAmount: 0 },
    );
  });

  it('procurar diários de viagem por nome de usuário', () => {
    prisma.tripDiary.findMany.mockResolvedValueOnce(tripDiaries);

    prisma.diaryPost.count.mockResolvedValueOnce(55);

    expect(service.findByUsername('fefezoka')).resolves.toStrictEqual(
      tripDiaries,
    );
  });

  it('procurar posts por id de diário de viagem', () => {
    prisma.diaryPost.findMany.mockResolvedValueOnce(diaryPosts);

    expect(service.findPostsById(2, currentUser)).resolves.toStrictEqual(
      diaryPosts.map((diaryPost) => {
        return {
          ...diaryPost,
          likesAmount: 2,
          isLiked: true,
        };
      }),
    );
  });

  describe('procurar diário de viagem por id', () => {
    it('diário não existe', () => {
      prisma.tripDiary.findUnique.mockResolvedValueOnce(null);
      expect(service.findOne(2)).rejects.toThrowError(new NotFoundException());
    });

    it('diário existe', () => {
      prisma.tripDiary.findUnique.mockResolvedValueOnce(tripDiaries[0]);
      prisma.diaryPost.count.mockResolvedValueOnce(64);
      expect(service.findOne(2)).resolves.toStrictEqual({
        ...tripDiaries[0],
        postsAmount: 64,
      });
    });
  });

  describe('remover', () => {
    it('diário não existe', () => {
      prisma.tripDiary.findUnique.mockResolvedValueOnce(null);
      expect(service.remove(2, currentUser)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('usuário não é o criador do diário', () => {
      prisma.tripDiary.findUnique.mockResolvedValueOnce(tripDiaries[0]);
      expect(
        service.remove(2, { ...currentUser, id: 22 }),
      ).rejects.toThrowError(new UnauthorizedException());
    });

    it('removido com sucesso', () => {
      prisma.tripDiary.findUnique.mockResolvedValueOnce(tripDiaries[0]);
      expect(service.remove(2, currentUser)).resolves.not.toThrowError();
    });
  });
});
