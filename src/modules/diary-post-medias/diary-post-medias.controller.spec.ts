import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostMediasController } from './diary-post-medias.controller';
import { DiaryPostMediasService } from './diary-post-medias.service';

describe('DiaryPostMediasController', () => {
  let controller: DiaryPostMediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiaryPostMediasController],
      providers: [DiaryPostMediasService],
    }).compile();

    controller = module.get<DiaryPostMediasController>(DiaryPostMediasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
