import { Router } from "express";
import * as TRC from "../controllers/TrainingRegister/TrainingRegister.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/TrainingRegister/TrainingRegister.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//login admin SuperAdmins
router.post(
  "/addTraining",
  valid(vSchema.addTraining),
  isAuth([roles.stu]),
  TRC.addTraining
);

router.patch(
  "/deleteTraining",
  isAuth([roles.stu]),
  valid(vSchema.deleteTraining),
  TRC.deleteTraining
);

router.get("/getTrainingInfo", isAuth([roles.stu]), TRC.getTraining);

router.get(
  "/searchTraining",
  valid(vSchema.searchRegister),
  isAuth([roles.stu, roles.admin, roles.instructor]),
  TRC.searchRegisterTraining
);
export default router;
