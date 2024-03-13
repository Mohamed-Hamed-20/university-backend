import { Router } from "express";
import * as tgc from "../controllers/totalgrates/TotalGrates.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/totalgrates/TotalGrates.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
const router = Router();

//user routes

// router.post("/login", valid(vSchema.login), uc.login);

router.post(
  "/addtotalgrates",
  //   valid(vSchema.addsemster),
  //   isAuth([roles.instructor]),
  tgc.addtotalgrates
);
// missed login with Gmail   <<<<=====
export default router;
