import { Module } from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CityVisitsController } from './city-visits.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityVisitsController],
  providers: [CityVisitsService],
})
export class CityVisitsModule {}
