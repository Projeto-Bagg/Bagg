import { Module } from '@nestjs/common';
import { ContinentsService } from './continents.service';
import { ContinentsController } from './continents.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContinentsController],
  providers: [ContinentsService],
})
export class ContinentsModule {}
