import SemesterModel from "../../DB/models/semster.model.js";
import settingModel from "../../DB/models/setting.model.js";

export const availableHoursForUser = async ({
  TotalGpa,
  RegisterInfo,
} = {}) => {
  try {
    const setting = await settingModel.findOne();
    if (!setting) {
      throw new Error("Need to provied semsterId first in setting");
    }
    const semsterInfo = await SemesterModel.findById(setting.MainSemsterId);
    if (!semsterInfo) {
      throw new Error("semster Info Invaild");
    }
    let availablehour;
    if (!RegisterInfo || RegisterInfo.coursesRegisterd.length == 0) {
      if (semsterInfo.term == "summer") {
        availablehour = semsterInfo.Max_Hours;
      } else {
        if (TotalGpa >= 2 && TotalGpa <= 4) {
          availablehour = semsterInfo.Max_Hours;
        } else if (TotalGpa >= 1 && TotalGpa < 2) {
          availablehour = semsterInfo.Max_Hours - 3;
        } else if (TotalGpa <= 0 && TotalGpa < 1) {
          availablehour = semsterInfo.Max_Hours - 6;
        }
      }
    } else {
      availablehour = RegisterInfo?.Available_Hours;
    }
    return availablehour;
  } catch (error) {
    throw new Error(error);
  }
};
