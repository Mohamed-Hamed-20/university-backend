import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
export const CreateInstructor = {
  body: joi
    .object({
      FullName: joi
        .string()
        .min(9)
        .max(66)
        .lowercase()
        .required()
        .messages(customMessages),
      email: generalFields.email.required().messages(customMessages),

      password: generalFields.password.required().messages(customMessages),

      Date_of_Birth: generalFields.date.optional().messages(customMessages),

      phone: generalFields.PhoneNumber.required().messages(customMessages),

      gender: generalFields.gender.optional().messages(customMessages),

      department: generalFields.department.required().messages(customMessages),

      Materials: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),

      Training: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
    })
    .required(),
};
export const login = {
  body: joi
    .object({
      email: generalFields.email.required().messages(customMessages),

      password: generalFields.password.required().messages(customMessages),
    })
    .required(),
};

export const updateInstructor = {
  body: joi
    .object({
      FullName: joi
        .string()
        .min(9)
        .max(66)
        .lowercase()
        .optional()
        .messages(customMessages),

      email: generalFields.email.optional().messages(customMessages),

      password: generalFields.password.optional().messages(customMessages),

      Date_of_Birth: generalFields.date.optional().messages(customMessages),

      phone: generalFields.PhoneNumber.optional().messages(customMessages),

      gender: generalFields.gender.optional().messages(customMessages),

      department: generalFields.department.optional().messages(customMessages),

      Materials: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),

      Training: joi
        .array()
        .items(generalFields._id.optional())
        .optional()
        .messages(customMessages),
    })
    .required(),
  // paramas: joi.object().required(),
  query: joi
    .object({
      userId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteInstructor = {
  query: joi
    .object({
      userId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const searchInstructor = {
  query: joi
    .object({
      sort: joi.string(),
      select: joi.string().min(3).max(100).messages(customMessages),

      page: joi.number().min(0).max(33).messages(customMessages),

      size: joi.number().min(0).max(23).messages(customMessages),

      search: joi.string().min(0).max(100).messages(customMessages),
    })
    .required(),
};

export const AddInstructorImg = {
  body: joi
    .object({
      InstructorId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteInstructorImg = {
  body: joi
    .object({
      InstructorId: generalFields._id.required().messages(customMessages),
      imgName: joi.string().min(15).required().messages(customMessages),
    })
    .required(),
};
