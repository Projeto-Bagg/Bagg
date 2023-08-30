import { Test, TestingModule } from '@nestjs/testing';
import { TipMediasService } from './tip-medias.service';

describe('TipMediasService', () => {
  let service: TipMediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipMediasService],
    }).compile();

    service = module.get<TipMediasService>(TipMediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
