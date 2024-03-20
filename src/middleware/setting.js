import { asyncHandler } from "../utils/errorHandling.js";

export const setting = asyncHandler(async (req, res, next) => {
  return (req, res, next) => {
      console.log({ path: req.path });
      
    };
});
