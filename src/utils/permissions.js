import { isString } from '@/utils/type-checks';
import { ROLES } from '@/config/types';
import store from '@/store';

export const checkPermission = (roles, roleId = store.getters['user/userRole'].id) => {
  if (!roles) return true;

  const rolesArray = isString(roles) ? [roles] : roles;
  const currentRoleId = roleId;
  const data = ROLES.keys.filter((key) => ROLES[key].id === currentRoleId);
  return rolesArray.includes(...data);
};
