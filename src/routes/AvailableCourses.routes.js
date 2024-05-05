import { Router } from "express";
import * as acc from "../controllers/AvailableCourses/AvailableCourses.js";
import { isAuth, roles } from "../middleware/auth.js";
import { limiter } from "../utils/apply.security.js";
import { routes } from "../utils/routes.path.js";
const router = Router();
const { Availablecourses } = routes.student;
//login admin SuperAdmins
router.post(`${Availablecourses}`,limiter({limit:50,Mintute:15}), isAuth([roles.stu]), acc.availableCourses);

export default router;
