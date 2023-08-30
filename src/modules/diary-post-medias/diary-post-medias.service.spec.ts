import { Test, TestingModule } from '@nestjs/testing';
import { DiaryPostMediasService } from './diary-post-medias.service';

describe('DiaryPostMediasService', () => {
  let service: DiaryPostMediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiaryPostMediasService],
    }).compile();

    service = module.get<DiaryPostMediasService>(DiaryPostMediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
