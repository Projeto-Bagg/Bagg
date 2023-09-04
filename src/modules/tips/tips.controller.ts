import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Tip } from './entities/tip.entity';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  create(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.create(createTipDto);
  }

  @Get()
  @ApiResponse({ type: Tip, isArray: true })
  findAll() {
    return this.tipsService.findMany();
  }

  @Get(':id')
  @ApiResponse({ type: Tip, isArray: false })
  findOne(@Param('id') id: string) {
    return this.tipsService.findUnique(+id);
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
