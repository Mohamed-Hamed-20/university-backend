import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
export const CreateInstructor = {
  body: joi
    .object({
      FullName: joi
        .string()
        .trim()
        .min(9)
        .max(66)
        .lowercase()
        .required()
        .messages(customMessages),
      email: generalFields.email.required(),

      password: generalFields.password.required(),

      Date_of_Birth: generalFields.date.optional(),

      phone: generalFields.PhoneNumber.required(),

      gender: generalFields.gender.optional(),

      department: generalFields.department.required(),

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
      email: generalFields.email.required(),

      password: generalFields.password.required(),
    })
    .required(),
};

export const updateInstructor = {
  body: joi
    .object({
      FullName: joi
        .string()
        .trim()
        .min(9)
        .max(66)
        .lowercase()
        .optional()
        .messages(customMessages),

      email: generalFields.email.optional(),

      password: generalFields.password.optional(),

      Date_of_Birth: generalFields.date.optional(),

      phone: generalFields.PhoneNumber.optional(),

      gender: generalFields.gender.optional(),

      department: generalFields.department.optional(),

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
      userId: generalFields._id.required(),
    })
    .required(),
};

export const deleteInstructor = {
  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
};

export const searchInstructor = {
  query: joi
    .object({
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,
    })
    .required(),
};

export const AddInstructorImg = {
  body: joi
    .object({
      InstructorId: generalFields._id.required(),
    })
    .required(),
};

export const deleteInstructorImg = {
  body: joi
    .object({
      InstructorId: generalFields._id.required(),
      imgName: joi
        .string()
        .min(15)
        .max(600)
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const GetInstructorInfoByAdmin = {
  query: joi
    .object({
      InstructorId: generalFields._id.required(),
    })
    .required(),
};
