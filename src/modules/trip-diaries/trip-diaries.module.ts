import { Module } from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { TripDiariesController } from './trip-diaries.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripDiariesController],
  providers: [TripDiariesService],
})
export class TripDiariesModule {}
