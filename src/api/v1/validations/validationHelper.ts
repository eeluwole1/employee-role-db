import Joi, { ArraySchema, BooleanSchema, NumberSchema, StringSchema } from "joi";

export const requiredString = (fieldName: string): StringSchema => {
  return Joi.string()
    .required()
    .messages({
      "any.required": `${fieldName} is required`,
      "string.empty": `${fieldName} cannot be empty`,
    });
};

export const requiredNumber = (fieldName: string): NumberSchema => {
  return Joi.number()
    .required()
    .messages({
      "any.required": `${fieldName} is required`,
      "number.base": `${fieldName} must be a number`,
    });
};

export const requiredBoolean = (fieldName: string): BooleanSchema => {
  return Joi.boolean()
    .required()
    .messages({
      "any.required": `${fieldName} is required`,
    });
};

export const requiredArray = (fieldName: string, min = 1): ArraySchema => {
  return Joi.array()
    .required()
    .min(1)
    .messages({
      "any.required": `${fieldName} is required`,
      "array.min": `${fieldName} must have atleast ${min} items`,
    });
};
