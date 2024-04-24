import joi from "joi";
import { customMessages, generalFields } from "../../middleware/validation.js";
import { AllRoutes } from "../../utils/routes.path.js";

export const updateSetting = {
  body: joi
    .object({
      deniedRoutes: joi
        .array()
        .items(
          joi
            .string()
            .trim()
            .valid(...AllRoutes)
            .optional()
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
