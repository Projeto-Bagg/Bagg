import { Module } from '@nestjs/common';
import { CityInterestsService } from './city-interests.service';
import { CityInterestsController } from './city-interests.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CityInterestsController],
  providers: [CityInterestsService],
})
export class CityInterestsModule {}
