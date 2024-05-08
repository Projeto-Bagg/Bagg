import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Tip, TipWord } from '@prisma/client';
import { TipWordByCountDto } from './dtos/tip-word-by-count.dto';

@Injectable()
export class TipWordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(sortByCount: boolean, startDate?: Date, endDate?: Date) {
    return (
      await this.prisma.tipWord.groupBy({
        by: ['word'],
        _count: { word: true },
        orderBy: sortByCount ? { _count: { word: 'desc' } } : undefined,
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })
    ).map(
      (tipWord) =>
        ({
          word: tipWord.word,
          count: tipWord._count.word,
        } as TipWordByCountDto),
    );
  }

  async indexTipWords(tip: Tip) {
    const tipWordsWithStrippedPunctuation = tip.message
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .replace(/\s{2,}/g, ' ')
      .split(' ')
      .flatMap((word) =>
        word.length > 2 ? [{ word: word, tipId: tip.id } as TipWord] : [],
      );

    await this.prisma.tipWord.createMany({
      data: tipWordsWithStrippedPunctuation,
    });
  }
}
