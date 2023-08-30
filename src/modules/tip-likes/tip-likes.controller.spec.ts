import { Test, TestingModule } from '@nestjs/testing';
import { TipLikesController } from './tip-likes.controller';
import { TipLikesService } from './tip-likes.service';

describe('TipLikesController', () => {
  let controller: TipLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipLikesController],
      providers: [TipLikesService],
    }).compile();

    controller = module.get<TipLikesController>(TipLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
