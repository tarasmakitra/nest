import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_POLICIES_KEY,
  Policy,
} from 'src/auth/decorators/checkPolicies.decorator';
import { AbilityService } from 'src/auth/services/ability.service';
import { UserInterface } from '../../user/interfaces/user.interface';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private abilityService: AbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policies =
      this.reflector.get<Policy[]>(CHECK_POLICIES_KEY, context.getHandler()) ||
      [];

    const { user } = context
      .switchToHttp()
      .getRequest<{ user: UserInterface }>();

    const ability = this.abilityService.createForUser(user);

    return policies.every((policy) => ability.can(...policy));
  }

}
