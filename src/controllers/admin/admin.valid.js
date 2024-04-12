import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
export const CreateAdmin = {
  body: joi
    .object({
      FullName: joi.string().min(9).max(66).required(),
      email: generalFields.email.required(),
      password: generalFields.password.required(),
      Date_of_Birth: joi.date().iso().required(),
      phone: generalFields.PhoneNumber.required(),
      gender: generalFields.gender.optional(),
    })
    .required(),
};
export const login = {
  body: joi
    .object({
      email: generalFields.email,
      password: generalFields.password,
    })
    .required(),
};

export const updateAdmin = {
  body: joi
    .object({
      FullName: joi.string().min(9).max(66).optional(),
      email: generalFields.email.optional(),
      password: generalFields.password.optional(),
      Date_of_Birth: joi.date().iso().optional(),
      phone: generalFields.PhoneNumber.optional(),
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
export const deleteAdmin = {
  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
};

export const searchAdmin = {
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

export const AddAdminImg = {
  body: joi
    .object({
      adminId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteAdminImg = {
  body: joi
    .object({
      adminId: generalFields._id.required().messages(customMessages),
      imgName: joi.string().min(15).required(),
    })
    .required(),
};
