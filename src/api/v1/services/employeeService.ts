import prisma from "../../../../prisma/client";
import { EmployeeDto } from "../types/employeeDto";
import { formatEmployee} from "../utils/formatEmployee";

export const fetchAllEmployees = async (): Promise<EmployeeDto[]> => {
  const data = await prisma.employee.findMany({
    include: {
      role: true,
    },
  });

  return data.map((emp): EmployeeDto => ({
    id: emp.id,
    name: emp.name,
    email: emp.email,    
    department: emp.department,
    roleId: emp.roleId ?? null,
    roleName: emp.role ? emp.role.name : null,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
  }));
};

export const getEmployeeById = async (id: string): Promise<EmployeeDto | null> => {
  const emp = await prisma.employee.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!emp) {
    return null;
  }

  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,      
    department: emp.department,
    roleId: emp.roleId ?? null,
    roleName: emp.role ? emp.role.name : null,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
  };
};

export const createEmployee = async (dto: EmployeeDto): Promise<EmployeeDto> => {
  const { id, roleName, ...data } = dto;

  const emp = await prisma.employee.create({
    data: {
      name: data.name,
      email: data.email,     
      department: data.department,
      roleId: data.roleId || null,
    },
    include: { role: true },
  });

  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,  
    department: emp.department,
    roleId: emp.roleId ?? null,
    roleName: emp.role ? emp.role.name : null,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
  };
};

export const updateEmployee = async (id: string, dto: EmployeeDto): Promise<EmployeeDto> => {
  const { roleName, ...data } = dto;

  const emp = await prisma.employee.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,  
      department: data.department,
      roleId: data.roleId || null,
    },
    include: { role: true },
  });

  return {
    id: emp.id,
    name: emp.name,
    email: emp.email,
    department: emp.department,
    roleId: emp.roleId ?? null,
    roleName: emp.role ? emp.role.name : null,
    createdAt: emp.createdAt,
    updatedAt: emp.updatedAt,
  };
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await prisma.employee.delete({ where: { id } });
};
