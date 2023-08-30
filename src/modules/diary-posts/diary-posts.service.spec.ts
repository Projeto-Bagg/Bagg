import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostsService } from './diary-posts.service';

describe('DiaryPostsService', () => {
  let service: DiaryPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryPostsService],
    }).compile();

    service = module.get<DiaryPostsService>(DiaryPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
