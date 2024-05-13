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
import { ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}
}
