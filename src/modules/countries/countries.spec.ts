import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';
import { CountriesService } from 'src/modules/countries/countries.service';
import { CountriesModule } from 'src/modules/countries/countries.module';
import { CityVisitsModule } from 'src/modules/city-visits/city-visits.module';
import { UsersModule } from 'src/modules/users/users.module';
import { NotFoundException } from '@nestjs/common';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { CountryPageDto } from 'src/modules/countries/dtos/country-page.dto';

const country: CountryEntity = {
  capital: 'Brasilia',
  continentId: 2,
  id: 2,
  iso2: 'BR',
  latitude: 2,
  longitude: 3,
  name: 'Brazil',
};

describe('tip comments service', () => {
  let service: CountriesService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CountriesModule,
        CityVisitsModule,
        CityInterestsModule,
        UsersModule,
      ],
      providers: [CountriesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(CountriesService);
    prisma = module.get(PrismaService);
  });

  describe('procurar por iso2', () => {
    it('país não existe', () => {
      prisma.country.findUnique.mockResolvedValueOnce(null);

      expect(service.findByIso2('123')).rejects.toThrowError(
        new NotFoundException(),
      );
    });

    it('retornando com sucesso', () => {
      const mock: CountryPageDto = {
        ...country,
        averageRating: 2.5,
        visitsCount: 144,
        interestsCount: 216,
        residentsCount: 2,
        reviewsCount: 100,
      };

      prisma.country.findUnique.mockResolvedValueOnce(country);

      prisma.cityVisit.aggregate.mockResolvedValueOnce({
        _avg: { rating: 2.5 },
        _count: undefined,
        _max: undefined,
        _min: undefined,
        _sum: undefined,
      });
      prisma.cityVisit.count.mockResolvedValueOnce(144);
      prisma.cityInterest.count.mockResolvedValueOnce(216);
      prisma.user.count.mockResolvedValueOnce(2);
      prisma.cityVisit.count.mockResolvedValueOnce(100);

      expect(service.findByIso2('BR')).resolves.toStrictEqual(mock);
    });
  });
});
