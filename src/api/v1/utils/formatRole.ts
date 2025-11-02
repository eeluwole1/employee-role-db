import type { Role } from "../../../../prisma/generated/prisma";
import { RoleDto } from "../types/roleDto";

export function formatRole(role: Role): RoleDto {
  return {
    id: role.id,
    name: role.name,
    description: role.description ?? null,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}
