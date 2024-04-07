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
      sort: joi.string(),
      select: joi.string().min(3).max(100),
      page: joi.number().min(0).max(33),
      size: joi.number().min(0).max(23),
      search: joi.string().min(0).max(100),
      // searchById: generalFields._id,
      trainingId: generalFields._id.optional(),
      studentId: generalFields._id,
    })
    .required(),
};
