import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";



export const addcourse = {
  body: joi
    .object({
      course_name: joi
        .string()
        .min(3)
        .max(60)
        .required()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).required().messages(customMessages),
      desc: joi.string().min(20).max(300).optional().messages(customMessages),
      OpenForRegistration: joi.boolean().optional().messages(customMessages),
      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      instructorId: generalFields._id.optional().messages(customMessages),
    })
    .required(),
};
export const updatecourse = {
  body: joi
    .object({
      course_name: joi
        .string()
        .min(3)
        .max(60)
        .optional()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).optional().messages(customMessages),
      desc: joi.string().min(20).max(300).optional().messages(customMessages),
      OpenForRegistration: joi.boolean().optional().messages(customMessages),
      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      instructorId: generalFields._id.optional().messages(customMessages),
    })
    .required(),
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deletecourse = {
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const searchcourse = {
  query: joi
    .object({
      sort: joi.string().messages(customMessages),
      select: joi.string().min(3).max(100).messages(customMessages),
      page: joi.number().min(0).max(33).messages(customMessages),
      size: joi.number().min(0).max(23).messages(customMessages),
      search: joi.string().min(0).max(100).messages(customMessages),
    })
    .required(),
};
