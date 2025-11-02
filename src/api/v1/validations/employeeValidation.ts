import Joi from "joi";

export const employeeSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  name: Joi.string().min(3).required(),
  department: Joi.string().min(2).required(),
  roleId: Joi.string().uuid().allow(null).optional(),
});
