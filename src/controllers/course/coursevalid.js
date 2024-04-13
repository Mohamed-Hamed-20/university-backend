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
        .lowercase()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).required().messages(customMessages),
      desc: joi.string().min(20).max(300).optional().messages(customMessages),
      OpenForRegistration: joi.boolean().optional().messages(customMessages),
      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      department: joi.array().items(generalFields.department),
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
        .lowercase()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).optional().messages(customMessages),
      desc: joi.string().min(20).max(300).optional().messages(customMessages),
      OpenForRegistration: joi.boolean().optional().messages(customMessages),
      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      department: joi.array().items(generalFields.department),
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

export const AddcourseImg = {
  body: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
      // courseImage: joi.required(),
    })
    .required(),
};

export const deletecourseImg = {
  body: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
      ImgUrls: joi
        .array()
        .items(joi.string().optional().messages(customMessages))
        .required()
        .messages(customMessages),
    })
    .required(),
};
