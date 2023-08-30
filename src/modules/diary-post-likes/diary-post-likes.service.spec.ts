import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostLikesService } from './diary-post-likes.service';

describe('DiaryPostLikesService', () => {
  let service: DiaryPostLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryPostLikesService],
    }).compile();

    service = module.get<DiaryPostLikesService>(DiaryPostLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
