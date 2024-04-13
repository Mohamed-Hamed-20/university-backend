import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addsemster = {
  body: joi
    .object({
      
      name: joi
        .string()
        .min(4)
        .max(55)
        .lowercase()
        .required()
        .messages(customMessages),
      
      term: joi
        .string()
        .valid("one", "two", "summer")
        .lowercase()
        .required()
        .messages(customMessages),
      
      year: joi.string().min(5).max(14).required().messages(customMessages),

      Max_Hours: joi
        .number()
        .min(2)
        .max(26)
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const updatesemster = {
  body: joi
    .object({
      name: joi
        .string()
        .min(4)
        .max(55)
        .lowercase()
        .optional()
        .messages(customMessages),

      term: joi
        .string()
        .valid("one", "two", "summer")
        .lowercase()
        .optional()
        .messages(customMessages),

      year: joi.string().min(5).max(14).optional().messages(customMessages),

      Max_Hours: joi
        .number()
        .min(2)
        .max(26)
        .optional()
        .messages(customMessages),
    })
    .required(),
  query: joi
    .object({
      semsterId: generalFields._id.required(),
    })
    .required(),
};
export const deletesemster = {
  query: joi
    .object({
      semsterId: generalFields._id.required(),
    })
    .required(),
};

export const FindSemster = {
  query: joi
    .object({
      semsterId: generalFields._id.required(),
    })
    .required(),
};
