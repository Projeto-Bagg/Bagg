import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';
import { CountriesModule } from 'src/modules/countries/countries.module';
import { CityVisitsModule } from 'src/modules/city-visits/city-visits.module';
import { UsersModule } from 'src/modules/users/users.module';
import { NotFoundException } from '@nestjs/common';
import { CitiesService } from 'src/modules/cities/cities.service';
import { DistanceModule } from 'src/modules/distance/distance.module';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityPageDto } from 'src/modules/cities/dtos/city-page.dto';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

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

const city: CityEntity = {
  id: 1,
  latitude: 2,
  longitude: 3,
  name: 'Pinhalzinho',
  regionId: 3,
};

const cities = [
  {
    id: 207,
    name: 'Tirana',
    regionId: 77,
    latitude: 41.3275,
    longitude: 19.81889,
    region: {
      id: 77,
      name: 'Tirana District',
      countryId: 3,
      latitude: 41.3275459,
      longitude: 19.8186982,
      country: {
        id: 3,
        name: 'Albania',
        iso2: 'AL',
        capital: 'Tirana',
        latitude: 41,
        longitude: 20,
        continentId: 4,
      },
    },
  },
  {
    id: 15438,
    name: 'Pinhalzinho',
    regionId: 509,
    latitude: -22.78213,
    longitude: -46.57177,
    region: {
      id: 509,
      name: 'São Paulo',
      countryId: 31,
      latitude: -23.5505199,
      longitude: -46.6333094,
      country: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        capital: 'Brasilia',
        latitude: -10,
        longitude: -55,
        continentId: 2,
      },
    },
  },
  {
    id: 15571,
    name: 'São Paulo',
    regionId: 509,
    latitude: -23.5475,
    longitude: -46.63611,
    region: {
      id: 509,
      name: 'São Paulo',
      countryId: 31,
      latitude: -23.5505199,
      longitude: -46.6333094,
      country: {
        id: 31,
        name: 'Brazil',
        iso2: 'BR',
        capital: 'Brasilia',
        latitude: -10,
        longitude: -55,
        continentId: 2,
      },
    },
  },
  {
    id: 64942,
    name: 'Shibuya-ku',
    regionId: 1951,
    latitude: 35.66404,
    longitude: 139.69821,
    region: {
      id: 1951,
      name: 'Tokyo',
      countryId: 110,
      latitude: 35.6761919,
      longitude: 139.6503106,
      country: {
        id: 110,
        name: 'Japan',
        iso2: 'JP',
        capital: 'Tokyo',
        latitude: 36,
        longitude: 138,
        continentId: 3,
      },
    },
  },
  {
    id: 64944,
    name: 'Shinjuku-ku',
    regionId: 1951,
    latitude: 35.69384,
    longitude: 139.70355,
    region: {
      id: 1951,
      name: 'Tokyo',
      countryId: 110,
      latitude: 35.6761919,
      longitude: 139.6503106,
      country: {
        id: 110,
        name: 'Japan',
        iso2: 'JP',
        capital: 'Tokyo',
        latitude: 36,
        longitude: 138,
        continentId: 3,
      },
    },
  },
  {
    id: 79356,
    name: 'Pyongyang',
    regionId: 2909,
    latitude: 39.03385,
    longitude: 125.75432,
    region: {
      id: 2909,
      name: 'Pyongyang',
      countryId: 162,
      latitude: 39.0392193,
      longitude: 125.7625241,
      country: {
        id: 162,
        name: 'North Korea',
        iso2: 'KP',
        capital: 'Pyongyang',
        latitude: 40,
        longitude: 127,
        continentId: 3,
      },
    },
  },
];

const cityVisit: CityVisitEntity = {
  cityId: city.id,
  createdAt: new Date(),
  id: 2,
  message: 'message',
  rating: 5,
  userId: user.id,
};

describe('tip comments service', () => {
  let service: CitiesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CountriesModule,
        CityVisitsModule,
        CityInterestsModule,
        DistanceModule,
        UsersModule,
      ],
      providers: [CitiesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(CitiesService);
    prisma = module.get(PrismaService);
  });

  describe('procurar por id', () => {
    it('país não existe', () => {
      prisma.city.findUnique.mockResolvedValueOnce(null);

      expect(service.findById(123)).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('retornando com sucesso', () => {
      const mock: CityPageDto = {
        ...city,
        isInterested: true,
        userVisit: cityVisit,
        averageRating: 2.5,
        visitsCount: 144,
        interestsCount: 216,
        residentsCount: 2,
        reviewsCount: 100,
      };

      prisma.city.findUnique.mockResolvedValueOnce(city);

      prisma.cityVisit.aggregate.mockResolvedValueOnce({
        _avg: { rating: 2.5 },
        _count: undefined,
        _max: undefined,
        _min: undefined,
        _sum: undefined,
      });
      prisma.cityVisit.count.mockResolvedValueOnce(144);
      prisma.cityVisit.count.mockResolvedValueOnce(100);
      prisma.cityInterest.count.mockResolvedValueOnce(216);
      prisma.user.count.mockResolvedValueOnce(2);
      prisma.cityInterest.findUnique.mockResolvedValueOnce({
        cityId: city.id,
        createdAt: new Date(),
        id: 3,
        userId: user.id,
      });
      prisma.cityVisit.findUnique.mockResolvedValueOnce(cityVisit);
      expect(service.findById(123, currentUser)).resolves.toStrictEqual(mock);
    });
  });

  it('trending', () => {
    prisma.cityInterest.count.mockResolvedValueOnce(7);
    // @ts-expect-error bug groupby
    prisma.cityInterest.groupBy.mockResolvedValueOnce([
      { _count: { cityId: 2 }, cityId: 15571 },
      { _count: { cityId: 1 }, cityId: 64942 },
      { _count: { cityId: 1 }, cityId: 64944 },
      { _count: { cityId: 1 }, cityId: 79356 },
      { _count: { cityId: 1 }, cityId: 207 },
      { _count: { cityId: 1 }, cityId: 15438 },
    ]);

    prisma.city.findMany.mockResolvedValueOnce(cities);

    // @ts-expect-error bug groupby
    prisma.cityInterest.groupBy.mockResolvedValueOnce([
      { _count: { cityId: 1 }, cityId: 207 },
    ]);

    expect(service.trending()).resolves.toStrictEqual({
      totalInterest: 7,
      cities: [
        {
          id: 15571,
          name: 'São Paulo',
          regionId: 509,
          latitude: -23.5475,
          longitude: -46.63611,
          region: {
            id: 509,
            name: 'São Paulo',
            countryId: 31,
            latitude: -23.5505199,
            longitude: -46.6333094,
            country: {
              id: 31,
              name: 'Brazil',
              iso2: 'BR',
              capital: 'Brasilia',
              latitude: -10,
              longitude: -55,
              continentId: 2,
            },
          },
          interestsCount: 2,
          percentFromTotal: 28.6,
          variation: 2,
          variationPercentage: null,
        },
        {
          id: 64942,
          name: 'Shibuya-ku',
          regionId: 1951,
          latitude: 35.66404,
          longitude: 139.69821,
          region: {
            id: 1951,
            name: 'Tokyo',
            countryId: 110,
            latitude: 35.6761919,
            longitude: 139.6503106,
            country: {
              id: 110,
              name: 'Japan',
              iso2: 'JP',
              capital: 'Tokyo',
              latitude: 36,
              longitude: 138,
              continentId: 3,
            },
          },
          interestsCount: 1,
          percentFromTotal: 14.3,
          variation: 1,
          variationPercentage: null,
        },
        {
          id: 64944,
          name: 'Shinjuku-ku',
          regionId: 1951,
          latitude: 35.69384,
          longitude: 139.70355,
          region: {
            id: 1951,
            name: 'Tokyo',
            countryId: 110,
            latitude: 35.6761919,
            longitude: 139.6503106,
            country: {
              id: 110,
              name: 'Japan',
              iso2: 'JP',
              capital: 'Tokyo',
              latitude: 36,
              longitude: 138,
              continentId: 3,
            },
          },
          interestsCount: 1,
          percentFromTotal: 14.3,
          variation: 1,
          variationPercentage: null,
        },
        {
          id: 79356,
          name: 'Pyongyang',
          regionId: 2909,
          latitude: 39.03385,
          longitude: 125.75432,
          region: {
            id: 2909,
            name: 'Pyongyang',
            countryId: 162,
            latitude: 39.0392193,
            longitude: 125.7625241,
            country: {
              id: 162,
              name: 'North Korea',
              iso2: 'KP',
              capital: 'Pyongyang',
              latitude: 40,
              longitude: 127,
              continentId: 3,
            },
          },
          interestsCount: 1,
          percentFromTotal: 14.3,
          variation: 1,
          variationPercentage: null,
        },
        {
          id: 207,
          name: 'Tirana',
          regionId: 77,
          latitude: 41.3275,
          longitude: 19.81889,
          region: {
            id: 77,
            name: 'Tirana District',
            countryId: 3,
            latitude: 41.3275459,
            longitude: 19.8186982,
            country: {
              id: 3,
              name: 'Albania',
              iso2: 'AL',
              capital: 'Tirana',
              latitude: 41,
              longitude: 20,
              continentId: 4,
            },
          },
          interestsCount: 1,
          percentFromTotal: 14.3,
          variation: 0,
          variationPercentage: 0,
        },
        {
          id: 15438,
          name: 'Pinhalzinho',
          regionId: 509,
          latitude: -22.78213,
          longitude: -46.57177,
          region: {
            id: 509,
            name: 'São Paulo',
            countryId: 31,
            latitude: -23.5505199,
            longitude: -46.6333094,
            country: {
              id: 31,
              name: 'Brazil',
              iso2: 'BR',
              capital: 'Brasilia',
              latitude: -10,
              longitude: -55,
              continentId: 2,
            },
          },
          interestsCount: 1,
          percentFromTotal: 14.3,
          variation: 1,
          variationPercentage: null,
        },
      ],
    });
  });
});
