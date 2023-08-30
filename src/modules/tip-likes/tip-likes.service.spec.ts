import { Test, TestingModule } from '@nestjs/testing';
import { TipLikesService } from './tip-likes.service';

describe('TipLikesService', () => {
  let service: TipLikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipLikesService],
    }).compile();

    service = module.get<TipLikesService>(TipLikesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
