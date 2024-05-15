import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Tip } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TipWordsService } from 'src/modules/tip-words/tip-words.service';

const tip: Tip = {
  cityId: 1,
  createdAt: new Date(),
  id: 1,
  message:
    'Se você está planejando sua próxima aventura e ainda não decidiu o destino, deixe-me compartilhar uma dica valiosa: vá para Bangkok! Esta cidade vibrante, repleta de cultura, história e uma energia única, oferece uma experiência de viagem inesquecível.',
  softDelete: false,
  status: 'active',
  tags: null,
  userId: 2,
};

describe('tip comments service', () => {
  let service: TipWordsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipWordsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(TipWordsService);
    prisma = module.get(PrismaService);
  });

  it('indexar palavras', () => {
    expect(service.indexTipWords(tip)).resolves.not.toThrowError();
    expect(prisma.tipWord.createMany).toBeCalledWith({
      data: [
        { word: 'você', tipId: tip.id },
        { word: 'está', tipId: tip.id },
        { word: 'planejando', tipId: tip.id },
        { word: 'próxima', tipId: tip.id },
        { word: 'aventura', tipId: tip.id },
        { word: 'ainda', tipId: tip.id },
        { word: 'decidiu', tipId: tip.id },
        { word: 'destino', tipId: tip.id },
        { word: 'deixeme', tipId: tip.id },
        { word: 'compartilhar', tipId: tip.id },
        { word: 'dica', tipId: tip.id },
        { word: 'valiosa', tipId: tip.id },
        { word: 'para', tipId: tip.id },
        { word: 'Bangkok', tipId: tip.id },
        { word: 'Esta', tipId: tip.id },
        { word: 'cidade', tipId: tip.id },
        { word: 'vibrante', tipId: tip.id },
        { word: 'repleta', tipId: tip.id },
        { word: 'cultura', tipId: tip.id },
        { word: 'história', tipId: tip.id },
        { word: 'energia', tipId: tip.id },
        { word: 'única', tipId: tip.id },
        { word: 'oferece', tipId: tip.id },
        { word: 'experiência', tipId: tip.id },
        { word: 'viagem', tipId: tip.id },
        { word: 'inesquecível', tipId: tip.id },
      ],
    });
  });
});
