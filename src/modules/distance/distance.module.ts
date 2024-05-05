import { Module } from '@nestjs/common';
import { DistanceService } from './distance.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DistanceController } from './distance.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DistanceController],
  providers: [DistanceService],
})
export class DistanceModule {}
