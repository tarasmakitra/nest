import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/user/interfaces/user.interface';
import { CanParameters } from '@casl/ability/dist/types/types';
import { PermissionFeature as Feature } from '../../common/types/permissionFeature';

export enum Action {
  View = 'view',
  Update = 'update',
  ViewEny = 'viewEny',
  UpdateEny = 'updateEny',
  Create = 'create',
  Delete = 'delete',
  DeleteEny = 'deleteEny',
}

export type AppAbility = Ability<[Action, Feature]>;

const PermissionLevel: Record<Action, number> = {
  [Action.View]: 1,
  [Action.Update]: 2,
  [Action.ViewEny]: 4,
  [Action.UpdateEny]: 8,
  [Action.Create]: 16,
  [Action.Delete]: 32,
  [Action.DeleteEny]: 64,
};

@Injectable()
export class AbilityService {
  createForUser(user: UserInterface) {
    const {
      can: allow,
      cannot: forbid,
      build,
      rules,
    } = new AbilityBuilder<Ability<[Action, Feature]>>(
      Ability as AbilityClass<AppAbility>,
    );

    user.permissions.forEach(({ feature, level }) => {
      Object.entries(PermissionLevel).forEach(([action, value]) => {
        if ((level & value) === value) {
          allow(action as Action, feature);
        }
      });
    });

    // forbid(Action.Delete, Page, { isPublished: true });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      // detectSubjectType: (item) => {
      //   console.log('name', item.constructor.name);
      //   return item.constructor as ExtractSubjectType<Subjects>;
      // },
    });
  }

  can(user: UserInterface, ...args: CanParameters<[Action, Feature]>) {
    return this.createForUser(user).can(...args);
  }
}
