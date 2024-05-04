import { Router } from "express";
import * as TRC from "../controllers/TrainingRegister/TrainingRegister.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/TrainingRegister/TrainingRegister.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { RegisterTraining } = routes;
//login admin SuperAdmins
router.post(
  `${RegisterTraining.addTraining}`,
  limiter({ limit: 30, Mintute: 60 }),
  valid(vSchema.addTraining),
  isAuth([roles.stu]),
  TRC.addTraining
);

router.patch(
  `${RegisterTraining.deleteTraining}`,
  limiter({ limit: 30, Mintute: 60 }),
  isAuth([roles.stu]),
  valid(vSchema.deleteTraining),
  TRC.deleteTraining
);

router.get(
  `${RegisterTraining.getTrainingRegisterdInfoTostu}`,
  limiter({ limit: 20, Mintute: 60 }),
  isAuth([roles.stu, roles.admin, roles.super]),
  TRC.getTraining
);

//=========================================================================================

//search Training Regsterd by Admin  ======>   EDIT_R
router.get(
  `${RegisterTraining.searchTrainingsRegisterdByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.searchRegister),
  isAuth([roles.admin, roles.super]),
  TRC.searchRegisterTraining
);

//search Training Regsterd by instructor  ======>   EDIT_R
router.get(
  `${RegisterTraining.searchTrainingsRegisterdByInstructor}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.searchRegister),
  isAuth([roles.instructor]),
  TRC.searchRegisterTraining
);

export default router;
