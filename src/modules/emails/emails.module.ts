import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailsService } from './emails-service';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
