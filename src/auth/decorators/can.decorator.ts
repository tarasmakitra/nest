import { applyDecorators, UseGuards } from '@nestjs/common';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import {
  CheckPolicies,
  Policy,
} from 'src/auth/decorators/checkPolicies.decorator';

export function Can(...policies: Policy[]) {
  return applyDecorators(UseGuards(PoliciesGuard), CheckPolicies(...policies));
}
