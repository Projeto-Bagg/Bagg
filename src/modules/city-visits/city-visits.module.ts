import { Module } from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CityVisitsController } from './city-visits.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';

@Module({
  imports: [PrismaModule, CityInterestsModule],
  controllers: [CityVisitsController],
  providers: [CityVisitsService],
  exports: [CityVisitsService],
})
export class CityVisitsModule {}
