import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
import { AllRoutes } from "../../utils/routes.path.js";

export const updateSetting = {
  body: joi
    .object({
      ApiUrls: joi
        .array()
        .items(
          joi.object({
            url: joi
              .string()
              .trim()
              .valid(...AllRoutes)
              .required()
              .messages({
                "string.base": "URL must be a string",
                "any.required": "URL is required",
                "string.empty": "URL cannot be empty",
                "any.only": "Invalid URL",
              }),
            allow: joi
              .string()
              .lowercase()
              .trim()
              .valid("yes", "no")
              .required(),
          })
        )
        .optional(),

      MainSemsterId: generalFields._id,

      MaxAllowTrainingToRegister: joi
        .number()
        .valid(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
        .optional(),
    })
    .required()
    .messages(customMessages),
};
export const deleteSetting = {};
