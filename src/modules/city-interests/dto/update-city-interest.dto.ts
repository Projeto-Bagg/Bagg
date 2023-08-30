import { PartialType } from '@nestjs/swagger';
import { CreateCityInterestDto } from './create-city-interest.dto';

export class UpdateCityInterestDto extends PartialType(CreateCityInterestDto) {}
