import { Module } from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CityVisitsController } from './city-visits.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityVisitsController],
  providers: [CityVisitsService],
  exports: [CityVisitsService],
})
export class CityVisitsModule {}
