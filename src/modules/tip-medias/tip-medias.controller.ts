import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipMediasService } from './tip-medias.service';
import { CreateTipMediaDto } from './dto/create-tip-media.dto';
import { UpdateTipMediaDto } from './dto/update-tip-media.dto';

@Controller('tip-medias')
export class TipMediasController {
  constructor(private readonly tipMediasService: TipMediasService) {}

  @Post()
  create(@Body() createTipMediaDto: CreateTipMediaDto) {
    return this.tipMediasService.create(createTipMediaDto);
  }

  @Get()
  findAll() {
    return this.tipMediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipMediasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipMediaDto: UpdateTipMediaDto) {
    return this.tipMediasService.update(+id, updateTipMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipMediasService.remove(+id);
  }
}
