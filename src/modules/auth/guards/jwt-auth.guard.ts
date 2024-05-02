import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { IS_EMAIL_VERIFICATION_UNNEEDED } from '../decorators/is-email-verification-unneeded.decorator';
import { IS_ADMIN_KEY } from 'src/modules/auth/decorators/is-admin.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.get<string[]>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    const isEmailVerificationUnneeded = this.reflector.get<string[]>(
      IS_EMAIL_VERIFICATION_UNNEEDED,
      context.getHandler(),
    );
    const isAdmin = this.reflector.get<string[]>(
      IS_ADMIN_KEY,
      context.getHandler(),
    );

    if (user) {
      if (user.role !== 'ADMIN' && isAdmin) {
        throw new UnauthorizedException('insufficient permission');
      }

      if (!user.hasEmailBeenVerified && !isEmailVerificationUnneeded) {
        throw new UnauthorizedException('Email has not been verified');
      }
      return user;
    }
    if (isPublic) return;
    throw new UnauthorizedException();
  }
}
