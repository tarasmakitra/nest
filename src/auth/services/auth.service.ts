import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { PasswordService } from 'src/auth/services/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<UserInterface> {
    const user = await this.userService
      .getQueryBuilder()
      .where('user.email = :email', { email })
      .select(['user', 'permissions.feature', 'permissions.level'])
      .addSelect(['user.email', 'user.hashedPassword'])
      .leftJoin('user.permissions', 'permissions')
      .getOne();

    if (
      user &&
      (await this.passwordService.compare(password, user.hashedPassword))
    ) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async getAccessToken(user: Partial<UserInterface>) {
    return {
      user,
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
