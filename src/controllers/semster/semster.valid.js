import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addsemster = {
  body: joi
    .object({
      name: joi.string().min(4).max(55).required(),
      term: joi.string().valid("one", "two", "summer").required(),
      year: joi.string().min(5).max(14).required(),
      Max_Hours: joi.number().min(2).max(26).required(),
    })
    .required(),
};

export const updatesemster = {
  body: joi
    .object({
      name: joi.string().min(4).max(55).optional(),
      term: joi.string().valid("one", "two", "summer").optional(),
      year: joi.string().min(5).max(14).optional(),
      Max_Hours: joi.number().min(2).max(26).optional(),
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
