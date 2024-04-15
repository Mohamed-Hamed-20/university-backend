import { Router } from "express";
import * as tc from "../controllers/training/training.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/training/trainigvalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { Training } = routes;
router.post(
  `${Training.AddTraining}`,
  valid(vSchema.addtrain),
  isAuth([roles.admin]),
  tc.addtrain
);

router.put(
  `${Training.updateTraining}`,
  valid(vSchema.updatetrain),
  isAuth([roles.admin]),
  tc.updatetraining
);

router.delete(
  `${Training.deleteTraining}`,
  valid(vSchema.deletetrain),
  isAuth([roles.admin]),
  tc.deletetrain
);

//upload one or more image
router.post(
  `${Training.AddImages}`,
  multerCloud(allowedExtensions.Image).array("TrainingImage", 3),
  valid(vSchema.AddTrainingImg),
  isAuth([roles.admin]),
  tc.AddTrainingImg
);

router.patch(
  `${Training.deleteImages}`,
  valid(vSchema.deleteTrainingImg),
  isAuth([roles.admin]),
  tc.deleteTrainingImg
);

//======================================================================

// Training Information by Admin  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoByAdmin}`,
  valid(vSchema.TrainInfo),
  isAuth([roles.admin]),
  tc.TrainingInfo
);

// Training Information by instructor  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoByinstructor}`,
  valid(vSchema.TrainInfo),
  isAuth([roles.instructor]),
  tc.TrainingInfo
);

// Training Information by student  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoBystudent}`,
  valid(vSchema.TrainInfo),
  isAuth([roles.stu]),
  tc.TrainingInfo
);
// ==========================================================================================

// Training Search by Admin  ======>   EDIT_R
router.get(
  `${Training.allTrainingByAdmin}`,
  valid(vSchema.alltrain),
  isAuth([roles.admin]),
  tc.alltraining
);

// Training Search by student  ======>   EDIT_R
router.get(
  `${Training.allTrainingBystudent}`,
  valid(vSchema.alltrain),
  isAuth([roles.stu]),
  tc.alltraining
);

// Training Search by instructor  ======>   EDIT_R
router.get(
  `${Training.allTrainingByinstructor}`,
  valid(vSchema.alltrain),
  isAuth([roles.instructor]),
  tc.alltraining
);

export default router;
