import { Inject, Injectable } from '@nestjs/common';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

import { AUTH_CONFIG_KEY, AuthConfig } from 'src/auth/config/auth.config';

@Injectable()
export class PasswordService {
  constructor(@Inject(AUTH_CONFIG_KEY) private config: AuthConfig) {}

  hash(value: string): Promise<string> {
    return bcryptHash(this.getSaltedValue(value), this.config.hashRounds);
  }

  async compare(value: string, hashedValue?: string): Promise<boolean> {
    return (
      hashedValue && bcryptCompare(this.getSaltedValue(value), hashedValue)
    );
  }

  private getSaltedValue(value: string): string {
    return value + this.config.hashSalt;
  }
}
