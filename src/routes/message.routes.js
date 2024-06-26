import { Router } from "express";
import { isAuth, roles } from "../middleware/auth.js";
import * as MSG from "../controllers/message/message.js";

const router = Router();

router.get(
  "/:id",
  isAuth([roles.admin, roles.instructor, roles.stu, roles.super]),
  MSG.getMessages
);

router.post(
  "/send/:id",
  isAuth([roles.admin, roles.instructor, roles.stu, roles.super]),
  MSG.sendMessage
);

router.get(
  "/",
  isAuth([roles.admin, roles.stu, roles.super, roles.instructor]),
  MSG.getusersForSidebar
);

export default router;
