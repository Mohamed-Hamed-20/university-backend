import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addsemster = {
  body: joi
    .object({
      name: joi
        .string()
        .trim()
        .min(4)
        .max(55)
        .lowercase()
        .required()
        .messages(customMessages),

      term: joi
        .string()
        .trim()
        .lowercase()
        .valid("one", "two", "summer")
        .required()
        .messages(customMessages),

      year: joi
        .string()
        .trim()
        .lowercase()
        .min(5)
        .max(14)
        .required()
        .messages(customMessages),

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
        .trim()
        .lowercase()
        .min(4)
        .max(55)
        .optional()
        .messages(customMessages),

      term: joi
        .string()
        .trim()
        .lowercase()
        .valid("one", "two", "summer")
        .optional()
        .messages(customMessages),

      year: joi
        .string()
        .trim()
        .lowercase()
        .min(5)
        .max(14)
        .optional()
        .messages(customMessages),

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

export const searchsemster = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,
      semsterId: generalFields._id,
    })
    .required(),
};

