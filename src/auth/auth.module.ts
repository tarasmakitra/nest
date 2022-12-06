import { forwardRef, Module } from '@nestjs/common';
import { AbilityService } from 'src/auth/services/ability.service';
import { AuthService } from 'src/auth/services/auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PasswordService } from 'src/auth/services/password.service';
import { ConfigModule } from '@nestjs/config';
import authConfig from 'src/auth/config/auth.config';
import { AuthController } from 'src/auth/controllers/auth.controller';
import { AuthConfigService } from 'src/auth/services/authConfig.service';
import { PermissionService } from './services/permission.service';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule, AuthModule],
      useFactory: async ({ secret, expiresIn }: AuthConfigService) => ({
        secret,
        signOptions: {
          expiresIn,
        },
      }),
      inject: [AuthConfigService],
    }),
  ],
  providers: [
    AbilityService,
    AuthService,
    AuthConfigService,
    PasswordService,
    PermissionService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD, // register as global guard
      useClass: JwtGuard,
    },
  ],
  exports: [
    AbilityService,
    AuthService,
    AuthConfigService,
    PasswordService,
    PermissionService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
