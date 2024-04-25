import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const CreateAdmin = {
  body: joi
    .object({
      FullName: joi
        .string()
        .min(9)
        .max(66)
        .trim()
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
      email: generalFields.email.required(),
      password: generalFields.password.required(),
    })
    .required(),
};

export const SendconfirmEmailValid = {
  query: joi
    .object({
      key: joi.string().trim().required(),
    })
    .required(),
};

export const checkConfirmEmail = {
  params: joi
    .object({
      key: joi.string().trim().required(),
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
        .trim()
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
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,
    })
    .required(),
};

export const AddAdminImg = {
  body: joi
    .object({
      adminId: generalFields._id.required(),
    })
    .required(),
};

export const deleteAdminImg = {
  body: joi
    .object({
      adminId: generalFields._id.required(),
      imgName: joi.string().trim().min(15).required().messages(customMessages),
    })
    .required(),
};
