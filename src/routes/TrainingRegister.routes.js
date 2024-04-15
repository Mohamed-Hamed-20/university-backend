import { Router } from "express";
import * as TRC from "../controllers/TrainingRegister/TrainingRegister.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/TrainingRegister/TrainingRegister.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { RegisterTraining } = routes;
//login admin SuperAdmins
router.post(
  `${RegisterTraining.addTraining}`,
  valid(vSchema.addTraining),
  isAuth([roles.stu]),
  TRC.addTraining
);

router.patch(
  `${RegisterTraining.deleteTraining}`,
  isAuth([roles.stu]),
  valid(vSchema.deleteTraining),
  TRC.deleteTraining
);

router.get(
  `${RegisterTraining.getTrainingRegisterdInfoTostu}`,
  isAuth([roles.stu]),
  TRC.getTraining
);

//=========================================================================================

//search Training Regsterd by Admin  ======>   EDIT_R
router.get(
  `${RegisterTraining.searchTrainingsRegisterdByAdmin}`,
  valid(vSchema.searchRegister),
  isAuth([roles.admin]),
  TRC.searchRegisterTraining
);

//search Training Regsterd by instructor  ======>   EDIT_R
router.get(
  `${RegisterTraining.searchTrainingsRegisterdByInstructor}`,
  valid(vSchema.searchRegister),
  isAuth([roles.instructor]),
  TRC.searchRegisterTraining
);

export default router;
