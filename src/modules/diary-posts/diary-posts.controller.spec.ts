import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostsController } from './diary-posts.controller';
import { DiaryPostsService } from './diary-posts.service';

describe('DiaryPostsController', () => {
  let controller: DiaryPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryPostsController],
      providers: [DiaryPostsService],
    }).compile();

    controller = module.get<DiaryPostsController>(DiaryPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
