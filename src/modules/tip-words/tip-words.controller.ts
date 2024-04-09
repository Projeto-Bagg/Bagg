import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TipWordsService } from './tip-words.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipWordEntity } from './entities/tip-word.entity';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { TipWordsTrendingDto } from './dtos/tip-words-trending.dto';

@Controller('tip-words')
@ApiTags('tip-words')
export class TipWordsController {
  constructor(private readonly tipWordsService: TipWordsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  @ApiResponse({ type: TipWordEntity, isArray: true })
  async findMany(
    @Query() query: TipWordsTrendingDto,
  ): Promise<TipWordEntity[]> {
    const tipWords = await this.tipWordsService.findMany(
      query.sortByCount,
      query.startDate,
      query.endDate,
    );

    return tipWords as TipWordEntity[];
  }
}
