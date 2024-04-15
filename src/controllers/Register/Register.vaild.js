import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addToRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const deleteFromRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const getRegisterAdmin = {
  query: joi
    .object({
      studentId: generalFields._id.required(),
    })
    .required(),
};
export const searchRegister = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,

      courseId: generalFields._id.optional(),
      studentId: generalFields._id,
    })
    .required(),
};
export const searchRegisterInstructor = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,

      courseId: generalFields._id.required(),
      studentId: generalFields._id,
    })
    .required(),
};
