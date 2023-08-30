import { Test, TestingModule } from '@nestjs/testing';
import { CityInterestsController } from './city-interests.controller';
import { CityInterestsService } from './city-interests.service';

describe('CityInterestsController', () => {
  let controller: CityInterestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityInterestsController],
      providers: [CityInterestsService],
    }).compile();

    controller = module.get<CityInterestsController>(CityInterestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
