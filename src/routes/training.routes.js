import { Router } from "express";
import * as tc from "../controllers/training/training.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/training/trainigvalid.js";
import { isAuth, roles } from "../middleware/auth.js";
import { allowedExtensions, multerCloud } from "../utils/aws.s3.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { Training } = routes;

router.post(
  `${Training.AddTraining}`,
  limiter({limit:100,Mintute:60}),
  valid(vSchema.addtrain),
  isAuth([roles.admin]),
  tc.addtrain
);

router.put(
  `${Training.updateTraining}`,
  limiter({limit:70,Mintute:60}),
  valid(vSchema.updatetrain),
  isAuth([roles.admin]),
  tc.updatetraining
);

router.delete(
  `${Training.deleteTraining}`,
  limiter({limit:30,Mintute:60}),
  valid(vSchema.deletetrain),
  isAuth([roles.admin]),
  tc.deletetrain
);

//upload one or more image
router.post(
  `${Training.AddImages}`,
  limiter({limit:50,Mintute:60}),
  multerCloud(allowedExtensions.Image).array("TrainingImage", 3),
  valid(vSchema.AddTrainingImg),
  isAuth([roles.admin]),
  tc.AddTrainingImg
);

router.patch(
  `${Training.deleteImages}`,
  limiter({limit:30,Mintute:60}),
  valid(vSchema.deleteTrainingImg),
  isAuth([roles.admin]),
  tc.deleteTrainingImg
);

//======================================================================

// Training Information by Admin  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoByAdmin}`,
  limiter({limit:80,Mintute:60}),
  valid(vSchema.TrainInfo),
  isAuth([roles.admin]),
  tc.TrainingInfo
);

// Training Information by instructor  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoByinstructor}`,
  limiter({limit:80,Mintute:60}),
  valid(vSchema.TrainInfo),
  isAuth([roles.instructor]),
  tc.TrainingInfo
);

// Training Information by student  ======>   EDIT_R
router.get(
  `${Training.singleTraininginfoBystudent}`,
  limiter({limit:30,Mintute:60}),
  valid(vSchema.TrainInfo),
  isAuth([roles.stu]),
  tc.TrainingInfo
);
// ==========================================================================================

// Training Search by Admin  ======>   EDIT_R
router.get(
  `${Training.allTrainingByAdmin}`,
  limiter({limit:70,Mintute:60}),
  valid(vSchema.alltrain),
  isAuth([roles.admin]),
  tc.alltraining
);

// Training Search by student  ======>   EDIT_R
router.get(
  `${Training.allTrainingBystudent}`,
  limiter({limit:30,Mintute:60}),
  valid(vSchema.alltrain),
  isAuth([roles.stu]),
  tc.alltraining
);

// Training Search by instructor  ======>   EDIT_R
router.get(
  `${Training.allTrainingByinstructor}`,
  limiter({limit:40,Mintute:60}),
  valid(vSchema.alltrain),
  isAuth([roles.instructor]),
  tc.alltraining
);

export default router;
