import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from 'src/module/main-server/domain/user/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoleEnum[]) => SetMetadata(ROLES_KEY, roles);
