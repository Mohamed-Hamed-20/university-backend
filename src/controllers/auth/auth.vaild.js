import joi from "joi";
import { generalFields } from "../../middleware/validation.js";
import { roles } from "../../middleware/auth.js";

export const ResetPassword = {
  body: joi
    .object({
      key: joi.string().min(7).max(555).trim().required(),
      password: generalFields.password.required(),
      confrimPassword: joi.string().valid(joi.ref("password")).required(),
    })
    .required(),
};

export const forgetPassword = {
  body: joi
    .object({
      email: generalFields.email.required(),
      myRole: joi.string().valid(roles.admin, roles.instructor).required(),
    })
    .required(),
};
