import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addgrate = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
      semsterId: generalFields._id.required(),
      studentId: generalFields._id.required(),
      FinalExam: joi.number().min(0).max(50).required(),
      Oral: joi.number().min(0).max(10).required(),
      Practical: joi.number().min(0).max(20).required(),
      Midterm: joi.number().min(0).max(20).required(),
    })
    .required(),
};
export const updatecoursegrate = {
  body: joi
    .object({
      courseId: generalFields._id.optional(),
      semsterId: generalFields._id.optional(),
      studentId: generalFields._id.optional(),
      FinalExam: joi.number().min(0).max(50).optional(),
      Oral: joi.number().min(0).max(10).optional(),
      Practical: joi.number().min(0).max(20).optional(),
      Midterm: joi.number().min(0).max(20).optional(),
    })
    .required(),
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
};

export const deletecoursegrate = {
  query: joi
    .object({
      GradeId: generalFields._id.required(),
    })
    .required(),
  body: joi
    .object({
      backToRegister: joi.string().valid("yes", "no").lowercase().required(),
    })
    .required(),
};
export const studentsGratesSearch = {
  query: joi
    .object({
      sort: joi.string(),
      select: joi.string().min(3).max(100),
      searchId: generalFields._id,
      page: joi.number().min(0).max(33),
      size: joi.number().min(0).max(23),
      search: joi.string().min(0).max(100),
      searchById: generalFields._id,
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const gradeSingleuser = {};

export const stugrades = {
  query: joi
    .object({
      studentId: generalFields._id.optional(),
    })
    .required(),
};
