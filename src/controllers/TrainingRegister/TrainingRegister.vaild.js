import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

// create Training Result
export const addTraining = {
  query: joi
    .object({
      trainingId: generalFields._id.messages(customMessages).required(),
    })
    .required(),
};

// delete Training Result
export const deleteTraining = {
  query: joi
    .object({
      trainingId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

// update Training Result
export const searchRegister = {
  query: joi
    .object({
      sort: joi.string().messages(customMessages),
      select: joi.string().min(3).max(100).messages(customMessages),
      page: joi.number().min(0).max(33).messages(customMessages),
      size: joi.number().min(0).max(23).messages(customMessages),
      search: joi.string().min(0).max(100).messages(customMessages),
      // searchById: generalFields._id,
      trainingId: generalFields._id.optional().messages(customMessages),
      studentId: generalFields._id.messages(customMessages),
    })
    .required(),
};
