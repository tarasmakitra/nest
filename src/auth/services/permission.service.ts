import { Inject, Injectable, Scope } from '@nestjs/common';
import { AbilityService, Action } from './ability.service';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PermissionFeature as Feature } from '../../common/types/permissionFeature';
import { UserInterface } from '../../user/interfaces/user.interface';

@Injectable({ scope: Scope.REQUEST })
export class PermissionService {
  constructor(
    private readonly abilityService: AbilityService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  can(action: Action, feature: Feature): boolean {
    const user = this.request.user as UserInterface;
    return user && this.abilityService.can(user, action, feature);
  }
}
