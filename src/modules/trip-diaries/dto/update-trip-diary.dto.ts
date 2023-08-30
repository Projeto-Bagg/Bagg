import { PartialType } from '@nestjs/swagger';
import { CreateTripDiaryDto } from './create-trip-diary.dto';

export class UpdateTripDiaryDto extends PartialType(CreateTripDiaryDto) {}
