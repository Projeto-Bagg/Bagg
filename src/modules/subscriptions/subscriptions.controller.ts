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
import { SubscriptionsService } from './subscriptions.service';
import { UsersService } from '../users/users.service';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }
/*    
    @Post('/session')
    @ApiBearerAuth()
    @IsPublic()

    @ApiResponse({ type: , isArray: false})
    async() {
        this.subscriptionsService.
    }
    */
}
