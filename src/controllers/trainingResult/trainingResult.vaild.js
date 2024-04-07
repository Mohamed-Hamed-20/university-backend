import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";



// create Training Result
export const createTrainingResult = {
  body: joi
    .object({
      trainingId: generalFields._id.messages(customMessages).required(),
      studentId: generalFields._id.messages(customMessages),
      semsterId: generalFields._id.messages(customMessages),
    })
    .required(),
};


// delete Training Result
export const deleteTrainingResult = {
  query: joi
    .object({
      TrainingResultId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};


// update Training Result
export const updateTrainingResult = {
  query: joi
    .object({
      TrainingResultId: generalFields._id.required().messages(customMessages),
    })
    .required(),
  body: joi.object({
    Status: joi
      .string()
      .valid("pending", "uploaded", "refused", "accepted")
      .optional()
      .messages(customMessages),
    grade: joi.number().min(0).max(100).optional(),
    trainingId: generalFields._id.optional().messages(customMessages),
    studentId: generalFields._id.optional().messages(customMessages),
  }),
};
export const getSingleTrainingResult = {};
export const SearchTrainingResult = {
  body: joi.object({
    semsterId: generalFields._id.optional().messages(customMessages),
    studentId: generalFields._id.optional().messages(customMessages),
    trainingId: generalFields._id.optional().messages(customMessages),
  }),
};
