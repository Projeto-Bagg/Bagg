import { Test, TestingModule } from '@nestjs/testing';
import { CityInterestsService } from './city-interests.service';

describe('CityInterestsService', () => {
  let service: CityInterestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityInterestsService],
    }).compile();

    service = module.get<CityInterestsService>(CityInterestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
