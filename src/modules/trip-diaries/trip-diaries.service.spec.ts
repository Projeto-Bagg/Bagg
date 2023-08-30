import { Test, TestingModule } from '@nestjs/testing';
import { TripDiariesService } from './trip-diaries.service';

describe('TripDiariesService', () => {
  let service: TripDiariesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripDiariesService],
    }).compile();

    service = module.get<TripDiariesService>(TripDiariesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
