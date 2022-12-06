import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { PasswordGuard } from 'src/auth/guards/password.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserService } from 'src/user/services/user.service';
import { RegisterInput } from 'src/auth/inputs/register.input';

@Controller({
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @UseGuards(PasswordGuard)
  async login(@Request() req) {
    return this.authService.getAccessToken(req.user);
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterInput) {
    return await this.userService.create(body);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
