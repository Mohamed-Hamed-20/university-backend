import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const registeruser = {
  body: joi
    .object({
      Full_Name: joi.string().min(9).max(66).required(),
      National_Id: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .required(),
      Student_Code: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .required(),
      semsterId: generalFields._id.required(),
      Date_of_Birth: joi.date().iso().required(),
      PhoneNumber: generalFields.PhoneNumber.required(),
      department: generalFields.department.optional(),
      gender: generalFields.gender.optional(),
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
        .required(),
      password: joi.string().min(8).max(24).required(),
    })
    .required(),
};

export const updateStudent = {
  body: joi
    .object({
      Full_Name: joi.string().min(9).max(66).optional(),
      National_Id: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .optional(),
      Student_Code: joi
        .string()
        .pattern(/^[0-9]{14}$/)
        .optional(),
      semsterId: generalFields._id.optional(),
      Date_of_Birth: joi.date().iso().optional(),
      PhoneNumber: generalFields.PhoneNumber.optional(),
      department: generalFields.department.optional(),
      gender: generalFields.gender.optional(),
    })
    .required(),
  // paramas: joi.object().required(),
  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
  // file: joi.object().required(),
};

export const deleteStudent = {
  query: joi
    .object({
      userId: generalFields._id.required(),
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
