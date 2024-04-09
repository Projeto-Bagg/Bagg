import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Tip, TipWord } from '@prisma/client';

@Injectable()
export class TipWordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(sortByCount: boolean, startDate: Date, endDate: Date) {
    const orderBy: Prisma.TipWordOrderByWithRelationInput[] = [
      {
        word: 'desc',
      },
    ];

    return await this.prisma.tipWord.findMany({
      orderBy: sortByCount ? orderBy : undefined,
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async indexTipWords(tip: Tip) {
    const tipWordsWithStrippedPunctuation = tip.message
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ')
      .map((word) => ({ tipId: tip.id, word: word } as TipWord));
    await this.prisma.tipWord.createMany({
      data: tipWordsWithStrippedPunctuation,
    });
  }
}
