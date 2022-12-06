import { PermissionFeature } from '../../common/types/permissionFeature';

export interface PermissionInterface {
  id?: number;
  feature: PermissionFeature;
  level: number;
}
