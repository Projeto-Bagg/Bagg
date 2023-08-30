import { Test, TestingModule } from '@nestjs/testing';
import { TipMediasController } from './tip-medias.controller';
import { TipMediasService } from './tip-medias.service';

describe('TipMediasController', () => {
  let controller: TipMediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipMediasController],
      providers: [TipMediasService],
    }).compile();

    controller = module.get<TipMediasController>(TipMediasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
