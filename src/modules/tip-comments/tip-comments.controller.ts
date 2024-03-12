import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { TipCommentsService } from './tip-comments.service';
import { TipCommentEntity } from './entities/tip-comment.entity';
import { CreateTipCommentDto } from './dtos/create-tip-comment.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';

@Controller('tip-comments')
@ApiTags('tip-comments')
export class TipCommentsController {
  constructor(private readonly tipCommentsService: TipCommentsService) {}

  @Get(':tipId')
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @ApiResponse({ type: TipCommentEntity, isArray: true })
  async findByTip(@Param('tipId') tipId: number): Promise<TipCommentEntity[]> {
    const comments = await this.tipCommentsService.findByTip(tipId);

    return comments.map((comment) => new TipCommentEntity(comment));
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: TipCommentEntity })
  async create(
    @Body() createTipCommentDto: CreateTipCommentDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipCommentEntity> {
    const comment = await this.tipCommentsService.create(
      createTipCommentDto,
      currentUser,
    );

    return new TipCommentEntity(comment);
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(
    @Param('id') id: number,
    @CurrentUser() CurrentUser: UserFromJwt,
  ): Promise<void> {
    return this.tipCommentsService.delete(id, CurrentUser);
  }
}
