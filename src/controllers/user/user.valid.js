import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const registeruser = {
  body: joi
    .object({
      Full_Name: joi
        .string()
        .min(9)
        .max(66)
        .trim()
        .lowercase()
        .required()
        .messages(customMessages),
      National_Id: joi
        .string()
        .trim()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      Student_Code: joi
        .string()
        .trim()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      Date_of_Birth: joi.date().iso().required().messages(customMessages),
      PhoneNumber: generalFields.PhoneNumber.required(),
      department: generalFields.department.optional(),
      gender: generalFields.gender.optional(),
    })
    .required(),
};

export const login = {
  body: joi
    .object({
      Student_Code: joi
        .string()
        .trim()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      password: joi
        .string()
        .trim()
        .min(8)
        .max(24)
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const updateStudent = {
  body: joi
    .object({
      Full_Name: joi
        .string()
        .trim()
        .lowercase()
        .min(9)
        .max(66)
        .optional()
        .messages(customMessages),
      National_Id: joi
        .string()
        .trim()
        .pattern(/^[0-9]{14}$/)
        .optional()
        .messages(customMessages),
      Student_Code: joi
        .string()
        .trim()
        .pattern(/^[0-9]{14}$/)
        .optional()
        .messages(customMessages),
      Date_of_Birth: joi.date().iso().optional().messages(customMessages),
      PhoneNumber:
        generalFields.PhoneNumber.optional().messages(customMessages),
      department: generalFields.department.optional(),
      gender: generalFields.gender.optional(),
    })
    .required(),
  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
};

export const deleteStudent = {
  query: joi
    .object({
      userId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};
export const searchuser = {
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

export const AddStuImg = {
  body: joi
    .object({
      studentId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteStuImg = {
  body: joi
    .object({
      studentId: generalFields._id.required().messages(customMessages),
      imgName: joi
        .string()
        .min(15)
        .max(100)
        .required()
        .messages(customMessages),
    })
    .required(),
};

export const StudeleteStuImg = {
  body: joi
    .object({
      imgName: joi
        .string()
        .min(15)
        .max(100)
        .required()
        .messages(customMessages),
    })
    .required(),
};
