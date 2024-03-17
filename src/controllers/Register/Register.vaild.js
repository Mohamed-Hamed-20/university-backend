import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

export const addToRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const deleteFromRegister = {
  query: joi
    .object({
      courseId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};
