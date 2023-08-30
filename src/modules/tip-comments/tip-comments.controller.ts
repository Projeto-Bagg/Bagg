import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { CreateTipCommentDto } from './dto/create-tip-comment.dto';
import { UpdateTipCommentDto } from './dto/update-tip-comment.dto';

@Controller('tip-comments')
export class TipCommentsController {
  constructor(private readonly tipCommentsService: TipCommentsService) {}

  @Post()
  create(@Body() createTipCommentDto: CreateTipCommentDto) {
    return this.tipCommentsService.create(createTipCommentDto);
  }

  @Get()
  findAll() {
    return this.tipCommentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipCommentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipCommentDto: UpdateTipCommentDto) {
    return this.tipCommentsService.update(+id, updateTipCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipCommentsService.remove(+id);
  }
}
