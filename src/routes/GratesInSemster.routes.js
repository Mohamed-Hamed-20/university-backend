import { Router } from "express";
import * as uc from "../controllers/StudentGratesInSemster/GratesInSemster.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/StudentGratesInSemster/GratesInSemster.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//user routes

router.post(
  "/addToGratesSemster",
  valid(vSchema.addToGratesSemster),
//   isAuth([roles.admin]),
  uc.addToGratesSemster3
);

export default router;
