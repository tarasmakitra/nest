import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInterface } from '../../user/interfaces/user.interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserInterface => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
