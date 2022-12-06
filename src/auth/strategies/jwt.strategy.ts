import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { AUTH_CONFIG_KEY, AuthConfig } from 'src/auth/config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    @Inject(AUTH_CONFIG_KEY) private authConfig: AuthConfig,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.jwtSecret,
      // TODO jsonWebTokenOptions: {
      // },
    });
  }

  // TODO add type
  async validate(payload: { sub?: string }): Promise<User> {
    // TODO validate null|undefined
    return this.userService
      .getQueryBuilder()
      .where('user.id = :id', { id: payload.sub })
      .select(['user', 'permissions.feature', 'permissions.level'])
      .addSelect(['user.email'])
      .leftJoin('user.permissions', 'permissions')
      .getOne();
  }
}
