import type { Employee, Role } from "../../../../prisma/generated/prisma";
import { EmployeeDto } from "../types/employeeDto";

export function formatEmployee(
  employee: Employee & { role?: Role | null }
): EmployeeDto {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department,
    roleId: employee.roleId ?? null,
    roleName: employee.role ? employee.role.name : null,
    createdAt: employee.createdAt,
    updatedAt: employee.updatedAt,
  };
}
