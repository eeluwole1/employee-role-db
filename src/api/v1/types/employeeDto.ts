export interface EmployeeDto {
  id?: string;
  name: string;
  email: string;
  department: string;
  roleId?: string | null;
  roleName?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
