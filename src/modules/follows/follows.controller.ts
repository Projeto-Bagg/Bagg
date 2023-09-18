import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('follows')
@ApiTags('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  create(@Body() createFollowDto: CreateFollowDto) {
    return this.followsService.create(createFollowDto);
  }

  @Get()
  findAll() {
    return this.followsService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.followsService.findUnique(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFollowDto: UpdateFollowDto) {
    return this.followsService.update(+id, updateFollowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.followsService.delete(+id);
  }
}
