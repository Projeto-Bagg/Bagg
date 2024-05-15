import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export enum ReportReasonEnum {
  hate = 'hate',
  violent = 'violent',
  spam = 'spam',
  nudity = 'nudity',
  'false-information' = 'false-information',
}

export class ReportEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(ReportReasonEnum)
  reason: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  reviewed: boolean;
}
