import { Action } from 'src/auth/services/ability.service';
import { SetMetadata } from '@nestjs/common';
import { PermissionFeature } from '../../common/types/permissionFeature';

export const CHECK_POLICIES_KEY = 'check_policy';

export type Policy = [Action, PermissionFeature];

export const CheckPolicies = (...policies: Policy[]) =>
  SetMetadata(CHECK_POLICIES_KEY, policies);
