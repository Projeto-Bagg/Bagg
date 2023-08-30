import { Test, TestingModule } from '@nestjs/testing';
import { TripDiariesController } from './trip-diaries.controller';
import { TripDiariesService } from './trip-diaries.service';

describe('TripDiariesController', () => {
  let controller: TripDiariesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripDiariesController],
      providers: [TripDiariesService],
    }).compile();

    controller = module.get<TripDiariesController>(TripDiariesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
