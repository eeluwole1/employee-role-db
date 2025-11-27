import "reflect-metadata";
import { Request, Response } from "express";
import { Controller, Get, Post, Put, Param, Req, Res, UseBefore } from "routing-controllers";
import * as RoleService from "../services/roleService";
import { successResponse, errorResponse } from "../models/responseModel";
import { validateRequest } from "../middleware/validate";
import { roleSchema } from "../validations/roleValidation";
import { requireAuth } from "@clerk/express";

@Controller()
export class RoleController {
  @Get("/roles")
  async getAll(@Res() res: Response) {
    const roles = await RoleService.fetchAllRoles();
    return res.status(200).json(successResponse(roles, "Roles retrieved successfully"));
  }

  @Get("/roles/:id")
  async getById(@Param("id") id: string, @Res() res: Response) {
    const role = await RoleService.getRoleById(id);
    if (!role) {
      return res.status(404).json(errorResponse("Role not found"));
    }
    return res.status(200).json(successResponse(role, "Role retrieved successfully"));
  }

  @Post("/roles/create")
  @UseBefore(requireAuth())
  async create(@Req() req: Request, @Res() res: Response) {
    const newRole = await RoleService.createRole(req.body);
    return res.status(201).json(successResponse(newRole, "Role created successfully"));
  }

}
