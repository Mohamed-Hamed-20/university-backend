import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";

// create Training Result
export const createTrainingResult = {
  body: joi
    .object({
      trainingId: generalFields._id.messages(customMessages).required(),
      studentId: generalFields._id.messages(customMessages).required(),
      grade: joi
        .string()
        .valid("failed", "passed")
        .lowercase()
        .required()
        .messages(customMessages),
    })
    .required(),
};

// delete Training Result
export const deleteTrainingResult = {
  query: joi
    .object({
      TrainingResultId: generalFields._id.required().messages(customMessages),
      BackToRegister: joi
        .string()
        .valid("yes", "no")
        .lowercase()
        .required()
        .messages(customMessages),
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
    trainingId: generalFields._id.messages(customMessages).optional(),
    studentId: generalFields._id.messages(customMessages).optional(),
    grade: joi
      .string()
      .valid("failed", "passed")
      .lowercase()
      .optional()
      .messages(customMessages),
  }),
};
export const getSingleTrainingResult = {
  query: joi
    .object({
      TrainingResultId: generalFields._id.required().messages(customMessages),
    })
    .required(),
};

export const SearchTrainingResult = {
  query: joi.object({
    studentId: generalFields._id.optional().messages(customMessages),
    trainingId: generalFields._id.optional().messages(customMessages),
    sort: joi.string().messages(customMessages),
    select: joi.string().min(3).max(100).messages(customMessages),
    page: joi.number().min(0).max(33).messages(customMessages),
    size: joi.number().min(0).max(20).messages(customMessages),
    search: joi.string().min(0).max(100).messages(customMessages),
  }),
};
