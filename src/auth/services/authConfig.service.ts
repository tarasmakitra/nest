import { Inject, Injectable } from '@nestjs/common';
import { AUTH_CONFIG_KEY, AuthConfig } from 'src/auth/config/auth.config';

@Injectable()
export class AuthConfigService {
  constructor(@Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig) {}

  get secret(): string {
    return this.authConfig.jwtSecret;
  }

  get expiresIn(): string {
    return this.authConfig.jwtExpirationTime;
  }
}
