import { Controller } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('regions')
@ApiTags('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}
}
