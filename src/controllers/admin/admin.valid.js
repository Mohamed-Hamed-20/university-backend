import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
export const CreateAdmin = {
  body: joi
    .object({
      FullName: joi
        .string()
        .min(9)
        .max(66)
        .lowercase()
        .required()
        .messages(customMessages),
      email: generalFields.email.lowercase().required(),
      password: generalFields.password.required(),
      Date_of_Birth: generalFields.date.optional(),
      phone: generalFields.PhoneNumber.required(),
      gender: generalFields.gender.optional(),
    })
    .required(),
};
export const login = {
  body: joi
    .object({
      email: generalFields.email.required().messages(customMessages),
      password: generalFields.password.required(customMessages),
    })
    .required(),
};

export const updateAdmin = {
  body: joi
    .object({
      FullName: joi
        .string()
        .min(9)
        .max(66)
        .lowercase()
        .required()
        .messages(customMessages),
      email: generalFields.email.optional(),
      password: generalFields.password.optional(),
      Date_of_Birth: generalFields.date.optional(),
      phone: generalFields.PhoneNumber.optional(),
      gender: generalFields.gender.optional(),
    })
    .required(),

  query: joi
    .object({
      userId: generalFields._id.required(),
    })
    .required(),
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
      sort: joi.string().messages(customMessages),
      select: joi.string().min(3).max(100).messages(customMessages),
      page: joi.number().min(0).max(33).messages(customMessages),
      size: joi.number().min(0).max(23).messages(customMessages),
      search: joi.string().min(0).max(100).messages(customMessages),
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
      imgName: joi.string().min(15).required().messages(customMessages),
    })
    .required(),
};
