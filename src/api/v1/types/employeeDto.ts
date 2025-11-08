export interface EmployeeDto {
  id?: string;
  name: string;
  department: string;
  roleId?: string | null;
  roleName?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
