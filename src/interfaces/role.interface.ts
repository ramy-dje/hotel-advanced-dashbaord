import { SystemPermissions } from "./permissions/permissions";

// the Role interface
export default interface RoleInterface {
  createdAt: string | Date;
  id: string;
  name: string;
  deletable: boolean;
  permissions: SystemPermissions[];
  color: string;
}

// the create Role interface
export interface CreateRoleInterface {
  name: string;
  permissions: SystemPermissions[];
  color: string;
}
