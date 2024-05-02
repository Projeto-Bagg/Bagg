export interface UserPayload {
  sub: number;
  iat?: number;
  exp?: number;
  hasEmailBeenVerified?: boolean;
  role: string;
}
