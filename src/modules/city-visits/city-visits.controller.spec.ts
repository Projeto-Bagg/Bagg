import { Test, TestingModule } from '@nestjs/testing';
import { CityVisitsController } from './city-visits.controller';
import { CityVisitsService } from './city-visits.service';

describe('CityVisitsController', () => {
  let controller: CityVisitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityVisitsController],
      providers: [CityVisitsService],
    }).compile();

    controller = module.get<CityVisitsController>(CityVisitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
