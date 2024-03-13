import TotalGratesModel from "../../../DB/models/TotalGrates.model.js";
import userModel from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/errorHandling.js";

export const addtotalgrates = asyncHandler(async (req, res, next) => {
  const { userId, totalHoursPass, TotalGpa } = req.body;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("Invalid User Id", { cuase: 400 }));
  }
  const TotalGrates = {
    userId,
    totalHoursPass,
    TotalGpa,
  };
  const result = await TotalGratesModel.create(TotalGrates);
  return res.status(201).json({ message: "Create Success", result });
});
