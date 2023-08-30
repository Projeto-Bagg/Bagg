import { Test, TestingModule } from '@nestjs/testing';
import { TipCommentsService } from './tip-comments.service';

describe('TipCommentsService', () => {
  let service: TipCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipCommentsService],
    }).compile();

    service = module.get<TipCommentsService>(TipCommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
