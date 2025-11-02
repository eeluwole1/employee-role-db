import prisma from "../../../../prisma/client";
import { RoleDto } from "../types/roleDto";
import { formatRole } from "../utils/formatRole";

export const fetchAllRoles = async (): Promise<RoleDto[]> => {
  const roles = await prisma.role.findMany();
  return roles.map((r) => formatRole(r));
};

export const getRoleById = async (id: string): Promise<RoleDto | null> => {
  const role = await prisma.role.findUnique({ where: { id } });
  return role ? formatRole(role) : null;
};

export const createRole = async (roleDto: RoleDto): Promise<RoleDto> => {
  const role = await prisma.role.create({ data: roleDto });
  return formatRole(role);
};
