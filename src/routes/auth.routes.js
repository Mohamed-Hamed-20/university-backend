import { Router } from "express";
import { routes } from "../utils/routes.path.js";
import * as ac from "../controllers/auth/auth.js";
import * as vSchema from "../controllers/auth/auth.vaild.js";
import { limiter } from "../utils/apply.security.js";
import { valid } from "../middleware/validation.js";
const router = Router();
const { auth } = routes;

router.post(
  `${auth.forgetPassword}`,
  valid(vSchema.forgetPassword),
  limiter({ limit: 7, Mintute: 60 }),
  ac.forgetPassword
);

router.post(
  `${auth.Resetpass}/:key`,
  valid(vSchema.ResetPassword),
  ac.ResetPassword
);

export default router;
