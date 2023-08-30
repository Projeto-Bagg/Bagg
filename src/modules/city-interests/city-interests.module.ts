import { Module } from '@nestjs/common';
import { CityInterestsService } from './city-interests.service';
import { CityInterestsController } from './city-interests.controller';

@Module({
  controllers: [CityInterestsController],
  providers: [CityInterestsService]
})
export class CityInterestsModule {}
