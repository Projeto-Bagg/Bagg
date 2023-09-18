import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../models/AuthRequest';
import { UserFromJwt } from '../models/UserFromJwt';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserFromJwt => {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    return request.user;
  },
);
