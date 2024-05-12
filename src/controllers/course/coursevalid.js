import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addcourse = {
  body: joi
    .object({
      course_name: joi
        .string()
        .min(3)
        .max(60)
        .trim()
        .lowercase()
        .required()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).required().messages(customMessages),
      desc: joi
        .string()
        .trim()
        .min(20)
        .max(300)
        .optional()
        .messages(customMessages),

      OpenForRegistration: joi.boolean().optional().messages(customMessages),

      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      department: joi
        .array()
        .items(joi.string().valid("cs", "is", "ai", "sc").trim().lowercase())
        .optional(),
    })
    .required(),
};
export const updatecourse = {
  body: joi
    .object({
      course_name: joi
        .string()
        .trim()
        .min(3)
        .max(60)
        .optional()
        .lowercase()
        .messages(customMessages),
      credit_hour: joi.number().valid(2, 3).optional().messages(customMessages),
      desc: joi
        .string()
        .trim()
        .min(20)
        .max(300)
        .optional()
        .messages(customMessages),
      OpenForRegistration: joi.boolean().optional().messages(customMessages),
      Prerequisites: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
      department: joi
        .array()
        .items(joi.string().valid("cs", "is", "ai", "sc").trim().lowercase())
        .optional(),
    })
    .required(),
  query: joi
    .object({
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const deletecourse = {
  query: joi
    .object({
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const searchcourse = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,
      courseId: generalFields._id,
    })
    .required(),
};

export const AddcourseImg = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
    })
    .required(),
};

export const deletecourseImg = {
  body: joi
    .object({
      courseId: generalFields._id.required(),
      ImgUrls: joi
        .array()
        .items(joi.string().trim().max(600).optional().messages(customMessages))
        .required()
        .messages(customMessages),
    })
    .required(),
};
