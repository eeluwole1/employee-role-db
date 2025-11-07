import "reflect-metadata";
import { Request, Response } from "express";
import { Controller, Get, Post, Put, Delete, Param, Req, Res, UseBefore } from "routing-controllers";
import * as EmployeeService from "../services/employeeService";
import { successResponse, errorResponse } from "../models/responseModel";
import { validateRequest } from "../middleware/validate";
import { employeeSchema } from "../validations/employeeValidation";

@Controller()
export class EmployeeController {
  @Get("/employees")
  async getAll(@Req() _req: Request, @Res() res: Response) {
    const employees = await EmployeeService.fetchAllEmployees();
    return res.status(200).json(successResponse(employees, "Employees retrieved successfully"));
  }

  @Get("/employees/:id")
  async getById(@Param("id") id: string, @Res() res: Response) {
    const employee = await EmployeeService.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json(errorResponse("Employee not found"));
    }
    return res.status(200).json(successResponse(employee, "Employee retrieved successfully"));
  }

  @Post("/employees/create")
  @UseBefore(validateRequest(employeeSchema))
  async create(@Req() req: Request, @Res() res: Response) {
    const newEmployee = await EmployeeService.createEmployee(req.body);
    return res.status(201).json(successResponse(newEmployee, "Employee created successfully"));
  }

  @Put("/employees/update/:id")
  @UseBefore(validateRequest(employeeSchema))
  async update(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    const updated = await EmployeeService.updateEmployee(id, req.body);
    return res.status(200).json(successResponse(updated, "Employee updated successfully"));
  }

  @Delete("/employees/delete/:id")
  async delete(@Param("id") id: string, @Res() res: Response) {
    await EmployeeService.deleteEmployee(id);
    return res.status(200).json(successResponse(null, "Employee deleted successfully"));
  }
}
