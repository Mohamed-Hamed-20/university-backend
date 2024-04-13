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
      sort: joi.string().messages(customMessages),

      select: joi.string().min(3).max(100).messages(customMessages),

      page: joi.number().min(0).max(33).messages(customMessages),

      size: joi.number().min(0).max(23).messages(customMessages),

      search: joi.string().min(0).max(100).messages(customMessages),

      courseId: generalFields._id.required().messages(customMessages),

      studentId: generalFields._id.messages(customMessages),
    })
    .required(),
};
