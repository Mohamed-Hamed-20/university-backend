import SemesterModel from "../../../DB/models/semster.model.js";
import settingModel from "../../../DB/models/setting.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const updateSetting = asyncHandler(async (req, res, next) => {
  const { ApiUrl, Allow, MainSemsterId, MaxAllowTrainingToRegister } = req.body;

  // Make sure both ApiUrl and Allow are either both sent or both not sent
  if ((ApiUrl && !Allow) || (!ApiUrl && Allow)) {
    return next(
      new Error("Both ApiUrl and Allow must be sent or both not sent", {
        cause: 400,
      })
    );
  }

  // Find the existing setting or create a new one if it doesn't exist
  let setting = await settingModel.findOne();

  if (!setting) {
    if (!MainSemsterId) {
      return next(new Error("You need to provide SemsterId", { cause: 400 }));
    }
    // check this semster Vaild
    const semster = await SemesterModel.findById(MainSemsterId);
    if (!semster) {
      return next(new Error("Invalid SemsterId not found", { cause: 404 }));
    }

    //new doc
    const newSetting = {
      MainSemsterId: semster._id,
      deniedRoutes: [],
      MaxAllowTrainingToRegister: MaxAllowTrainingToRegister || 0,
    };

    //create new doc
    setting = await settingModel.create(newSetting);
    if (!setting) {
      return next(new Error("Server Error", { cause: 500 }));
    }
  }

  // Update the setting based on the provided data
  if (ApiUrl && Allow) {
    if (Allow == "yes") {
      const newDeniedRoutes = setting.deniedRoutes.filter((ApiPath) => {
        return ApiPath !== ApiUrl;
      });
      setting.deniedRoutes = newDeniedRoutes;
    } else if (Allow == "no") {
      if (!setting.deniedRoutes.includes(ApiUrl)) {
        setting.deniedRoutes.push(ApiUrl);
      }
    }
  }

  // Check if MainSemsterId is provided and update it if it's different
  if (
    MainSemsterId &&
    setting.MainSemsterId.toString() !== MainSemsterId.toString()
  ) {
    const semster = await SemesterModel.findById(MainSemsterId);
    if (!semster) {
      return next(new Error("Invalid SemsterId not found", { cause: 404 }));
    }
  }

  // Update MaxAllowTrainingToRegister if provided
  if (MaxAllowTrainingToRegister)
    setting.MaxAllowTrainingToRegister = MaxAllowTrainingToRegister;

  // Save the updated setting
  const result = await setting.save();
  return res
    .status(200)
    .json({ message: "Setting updated successfully", setting: result });
});

export const deleteSetting = asyncHandler(async (req, res, next) => {});

// ViewSetting
export const ViewSetting = asyncHandler(async (req, res, next) => {
  const setting = req.setting;

  return res.status(200).json({ message: "All setting Information", setting });
});

// settingAPIS
export const settingAPIS = asyncHandler(async (req, res, next) => {
  const setting = await settingModel.findOne();

  if (setting.deniedRoutes.includes(req.path)) {
    return next(new Error("Access to this service is denied", { cause: 403 }));
  }

  req.setting = setting;
  return next();
});
