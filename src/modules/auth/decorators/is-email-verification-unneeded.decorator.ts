import { SetMetadata } from '@nestjs/common';

export const IS_EMAIL_VERIFICATION_UNNEEDED = 'isEmailVerificationUnneeded';
export const IsEmailVerificationUnneeded = () =>
  SetMetadata(IS_EMAIL_VERIFICATION_UNNEEDED, true);
