import Joi from "joi";

export const roleSchema = Joi.object({
  id: Joi.string().uuid().optional(),
  name: Joi.string().min(3).required(),
  description: Joi.string().allow("").optional(),
});
