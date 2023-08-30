import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostLikesController } from './diary-post-likes.controller';
import { DiaryPostLikesService } from './diary-post-likes.service';

describe('DiaryPostLikesController', () => {
  let controller: DiaryPostLikesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryPostLikesController],
      providers: [DiaryPostLikesService],
    }).compile();

    controller = module.get<DiaryPostLikesController>(DiaryPostLikesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
