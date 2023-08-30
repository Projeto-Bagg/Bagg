import { Module } from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { TripDiariesController } from './trip-diaries.controller';

@Module({
  controllers: [TripDiariesController],
  providers: [TripDiariesService]
})
export class TripDiariesModule {}
