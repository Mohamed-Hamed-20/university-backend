import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const registeruser = {
  body: joi
    .object({
      Full_Name: joi
        .string()
        .min(9)
        .max(66)
        .required()
        .messages(customMessages),
      National_Id: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      Student_Code: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      Date_of_Birth: joi.date().iso().required().messages(customMessages),
      PhoneNumber:
        generalFields.PhoneNumber.required().messages(customMessages),
      department: generalFields.department.optional().messages(customMessages),
      gender: generalFields.gender.optional().messages(customMessages),
    })
    .required(),
  // paramas: joi.object().required(),
  // query: joi.object().required(),
  // file: joi.object().required(),
};

export const login = {
  body: joi
    .object({
      Student_Code: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .required()
        .messages(customMessages),
      password: joi.string().min(8).max(24).required().messages(customMessages),
    })
    .required(),
};

export const updateStudent = {
  body: joi
    .object({
      Full_Name: joi
        .string()
        .min(9)
        .max(66)
        .optional()
        .messages(customMessages),
      National_Id: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .optional()
        .messages(customMessages),
      Student_Code: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .optional()
        .messages(customMessages),
      Date_of_Birth: joi.date().iso().optional().messages(customMessages),
      PhoneNumber:
        generalFields.PhoneNumber.optional().messages(customMessages),
      department: generalFields.department.optional().messages(customMessages),
      gender: generalFields.gender.optional().messages(customMessages),
    })
    .required(),
  // paramas: joi.object().required(),
  query: joi
    .object({
      userId: generalFields._id.required().messages(customMessages),
    })
    .required(),
  // file: joi.object().required(),
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
      sort: joi.string(),
      select: joi.string().min(3).max(100),
      page: joi.number().min(0).max(33),
      size: joi.number().min(0).max(23),
      search: joi.string().min(0).max(100),
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
      imgName: joi.string().min(15).required().messages(customMessages),
    })
    .required(),
};
