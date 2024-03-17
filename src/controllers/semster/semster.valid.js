import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addsemster = {
  body: joi
    .object({
      name: joi.string().min(4).max(55).required(),
      level: joi
        .string()
        .valid("one", "two", "three", "four", "graduated")
        .required(),
      term: joi.string().valid("one", "two", "Summer").required(),
      Academic_Year: joi.string().min(5).max(14).required(),
      MinAvailableHours: joi.number().min(3).max(144).required(),
    })
    .required(),
};

export const updatesemster = {
  body: joi
    .object({
      name: joi.string().min(4).max(55).optional(),
      level: joi
        .string()
        .valid("one", "two", "three", "four", "graduated")
        .optional(),
      term: joi.string().valid("one", "two", "Summer").optional(),
      Academic_Year: joi.string().min(5).max(14).optional(),
      MinAvailableHours: joi.number().min(3).max(144).optional(),
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
