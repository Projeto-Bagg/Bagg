import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from '../models/UserFromJwt';
import { UserPayload } from '../models/UserPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        '7sFHZrGLIMIwTotAEyNS/j4yUEW7OtYmGebnAKWQOBJ/kB+ur4XnGt1oxnRC9HUOUK+hBfcOmqw+BmlgXFB4zRzte6LRqvXlLrNiXO+REDKycfYBFywXtFQ65ZE0B5Z9EwFXaP29QysUSc2HxDeWIMzfl5nMYDj0TYHEYPJPs2Zb4hKNPIpHdA2e+8r6imFsD5C5vh0P3psnLTX8liWgkC+8ENf1YxiORqAMt9kQ9Ola7WSkaTKe6dqLKGHDMeICTw2YcCZ7+I9yT4Umgncqz78pAsBHDJPE/oFMtxw9/moCMoMH2D6dJ34R09OQ/gv8lwIjKZfBVGNsqxHW8vuppw==',
    });
  }

  async validate(payload: UserPayload): Promise<UserFromJwt> {
    return {
      id: payload.sub,
    };
  }
}
