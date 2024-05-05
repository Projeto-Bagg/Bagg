import { Controller, Get } from '@nestjs/common';
import { ContinentsService } from './continents.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContinentEntity } from 'src/modules/continents/entities/continent.entity';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';

@Controller('continents')
@ApiTags('continents')
export class ContinentsController {
  constructor(private readonly continentsService: ContinentsService) {}

  @Get()
  @IsPublic()
  @ApiResponse({ type: ContinentEntity, isArray: true })
  findAll() {
    return this.continentsService.findMany();
  }
}
