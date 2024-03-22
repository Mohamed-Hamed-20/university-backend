import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addToRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteFromRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const searchRegister = {
  query: joi
    .object({
      sort: joi.string(),
      select: joi.string().min(3).max(100),
      page: joi.number().min(0).max(33),
      size: joi.number().min(0).max(23),
      search: joi.string().min(0).max(100),
      // searchById: generalFields._id,
      courseId: generalFields._id.required(),
      studentId: generalFields._id,
    })
    .required(),
};
