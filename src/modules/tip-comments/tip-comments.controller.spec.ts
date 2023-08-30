import { Test, TestingModule } from '@nestjs/testing';
import { TipCommentsController } from './tip-comments.controller';
import { TipCommentsService } from './tip-comments.service';

describe('TipCommentsController', () => {
  let controller: TipCommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipCommentsController],
      providers: [TipCommentsService],
    }).compile();

    controller = module.get<TipCommentsController>(TipCommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
