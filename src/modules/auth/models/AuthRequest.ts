import { Request } from 'express';
import { UserFromJwt } from './UserFromJwt';

export interface AuthRequest extends Request {
  user: UserFromJwt;
}
