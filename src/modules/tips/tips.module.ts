import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { TipsRepository } from './tips-repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TipsController],
  providers: [TipsService, { provide: TipsRepository, useClass: TipsService }],
})
export class TipsModule {}
