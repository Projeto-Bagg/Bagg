import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dtos/create-tip.dto';
import { UpdateTipDto } from './dtos/update-tip.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipEntity } from './entities/tip.entity';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  create(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.create(createTipDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: TipEntity, isArray: true })
  findAll() {
    return this.tipsService.findMany();
  }

  @Get(':id')
  @ApiResponse({ type: TipEntity, isArray: false })
  findOne(@Param('id') id: string) {
    return this.tipsService.findUnique(+id);
  }

  @Get(':userId/feed')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: TipEntity, isArray: true })
  findByUserCityInterest(
    @Param('userId') userId: string,
    @Query('tipCount') tipCount?: number,
    @Query('currentPage') currentPage?: number,
  ) {
    return this.tipsService.findByUserCityInterest(
      +userId,
      tipCount,
      currentPage,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.update(+id, updateTipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipsService.delete(+id);
  }
}
