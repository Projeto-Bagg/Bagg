import { Module } from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CityVisitsController } from './city-visits.controller';

@Module({
  controllers: [CityVisitsController],
  providers: [CityVisitsService],
})
export class CityVisitsModule {}
