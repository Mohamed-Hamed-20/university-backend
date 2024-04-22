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
        .trim()
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
      .trim()
      .lowercase()
      .valid("failed", "passed")
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
//admin
export const SearchTrainingResultByAdmin = {
  query: joi.object({
    studentId: generalFields._id.optional().messages(customMessages),
    trainingId: generalFields._id.optional().messages(customMessages),

    sort: generalFields.sort,
    select: generalFields.select,
    page: generalFields.page,
    size: generalFields.size,
    search: generalFields.search,
  }),
};

export const SearchTrainingResultByInstructor = {
  query: joi.object({
    studentId: generalFields._id.optional().messages(customMessages),
    trainingId: generalFields._id.required().messages(customMessages),

    sort: generalFields.sort,
    select: generalFields.select,
    page: generalFields.page,
    size: generalFields.size,
    search: generalFields.search,
  }),
};

// student
export const SearchTrainingResultByStudent = {
  query: joi.object({
    trainingId: generalFields._id.optional().messages(customMessages),

    sort: generalFields.sort,
    select: generalFields.select,
    page: generalFields.page,
    size: generalFields.size,
    search: generalFields.search,
  }),
};
