import { Test, TestingModule } from '@nestjs/testing';
import { CityVisitsService } from './city-visits.service';

describe('CityVisitsService', () => {
  let service: CityVisitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CityVisitsService],
    }).compile();

    service = module.get<CityVisitsService>(CityVisitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
