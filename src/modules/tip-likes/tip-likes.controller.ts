import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipLikesService } from './tip-likes.service';
import { CreateTipLikeDto } from './dto/create-tip-like.dto';
import { UpdateTipLikeDto } from './dto/update-tip-like.dto';

@Controller('tip-likes')
export class TipLikesController {
  constructor(private readonly tipLikesService: TipLikesService) {}

  @Post()
  create(@Body() createTipLikeDto: CreateTipLikeDto) {
    return this.tipLikesService.create(createTipLikeDto);
  }

  @Get()
  findAll() {
    return this.tipLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipLikesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipLikeDto: UpdateTipLikeDto) {
    return this.tipLikesService.update(+id, updateTipLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipLikesService.remove(+id);
  }
}
