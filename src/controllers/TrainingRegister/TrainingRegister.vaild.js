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
      sort: generalFields.sort,
      select: generalFields.select,
      page: generalFields.page,
      size: generalFields.size,
      search: generalFields.search,

      trainingId: generalFields._id.optional().messages(customMessages),
      studentId: generalFields._id.messages(customMessages),
    })
    .required(),
};
