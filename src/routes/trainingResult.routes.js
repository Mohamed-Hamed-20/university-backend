import { Router } from "express";
import * as trc from "../controllers/trainingResult/trainingResult.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/trainingResult/trainingResult.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { TrainingResult } = routes;

// upload Traing Grade by ADMIN 
router.post(
  `${TrainingResult.uploadByAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.createTrainingResult),
  isAuth([roles.admin, roles.super]),
  trc.uploadTrainingResult
);

//upload Traing Grade by instructor  ======>   EDIT_R
router.post(
  `${TrainingResult.uploadByInstructor}`,
  limiter({ limit: 70, Mintute: 60 }),
  valid(vSchema.createTrainingResult),
  isAuth([roles.instructor]),
  trc.uploadTrainingResult
);
// ================================

//delete Traing Grade by admin  ======>   EDIT_R
router.delete(
  `${TrainingResult.deleteByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.deleteTrainingResult),
  isAuth([roles.admin, roles.super]),
  trc.deleteTrainingResult
);

//delete Traing Grade by instructor  ======>   EDIT_R
router.delete(
  `${TrainingResult.deleteByInstructor}`,
  limiter({ limit: 60, Mintute: 60 }),
  valid(vSchema.deleteTrainingResult),
  isAuth([roles.instructor]),
  trc.deleteTrainingResult
);
//===========================================

//update trainig Information by admin  EDIT_R
router.put(
  `${TrainingResult.updateByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.updateTrainingResult),
  isAuth([roles.admin, roles.super]),
  trc.updateTrainingResult
);

//update training Information by instructor   EDIT_R
router.put(
  `${TrainingResult.updateByInstructor}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.updateTrainingResult),
  isAuth([roles.instructor]),
  trc.updateTrainingResult
);
// ==================================================================================
//get Single Training Result Information by student   EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByStudent}`,
  limiter({ limit: 20, Mintute: 60 }),
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.stu]),
  trc.getSingleTrainingResult
);

//get Single Training Result Information by instructor    EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByInstructor}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.instructor]),
  trc.getSingleTrainingResult
);

//get Single Training Result Information by Admin    EDIT_R
router.get(
  `${TrainingResult.getSingleTrainingResultByAdmin}`,
  limiter({ limit: 40, Mintute: 60 }),
  valid(vSchema.getSingleTrainingResult),
  isAuth([roles.admin, roles.super]),
  trc.getSingleTrainingResult
);
// =============================================================================================
//get Single Training Result Information by instructor    EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByInstructor}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.SearchTrainingResultByInstructor),
  isAuth([roles.instructor]),
  trc.SearchTrainingResult
);

//get Search Training Result Information by Admin        EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByAdmin}`,
  limiter({ limit: 50, Mintute: 60 }),
  valid(vSchema.SearchTrainingResultByAdmin),
  isAuth([roles.admin, roles.super]),
  trc.SearchTrainingResult
);

//get Search Training Result Information by student      EDIT_R
router.get(
  `${TrainingResult.SearchTrainingResultByStudent}`,
  limiter({ limit: 20, Mintute: 60 }),
  valid(vSchema.SearchTrainingResultByStudent),
  isAuth([roles.stu]),
  trc.SearchTrainingResult
);
export default router;
