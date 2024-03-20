import { Router } from "express";
import * as acc from "../controllers/Register/Register.js";
import { valid } from "../middleware/validation.js";
import * as vSchema from "../controllers/Register/Register.vaild.js";
import { isAuth, roles } from "../middleware/auth.js";
import RegisterModel from "../../DB/models/Register.model.js";
const router = Router();

//login admin SuperAdmins
router.post(
  "/addCourse",
  valid(vSchema.addToRegister),
  isAuth([roles.admin, roles.stu]),
  acc.addToRegister
);

router.patch(
  "/deleteCourse",
  isAuth([roles.admin, roles.stu]),
  valid(vSchema.deleteFromRegister),
  acc.deleteFromRegister
);

router.get("/getRegister", isAuth([roles.admin, roles.stu]), acc.getRegister);

router.get(
  "/searchRegister",
  valid(vSchema.searchRegister),
  isAuth([roles.admin, roles.instructor]),
  acc.searchRegister
);

//

//

//

// =====================================================

router.get("/registers/search", async (req, res) => {
  try {
    const { courseId, studentId, sortBy, sortOrder, page, limit } = req.query;
    let filters = {};
    if (courseId) filters.coursesRegisterd = courseId;
    if (studentId) filters.studentId = studentId;

    let sortOptions = {};
    if (sortBy) sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};
    if (endIndex < (await RegisterModel.countDocuments().exec())) {
      results.next = {
        page: parseInt(page) + 1,
        limit: parseInt(limit),
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: parseInt(page) - 1,
        limit: parseInt(limit),
      };
    }

    results.results = await RegisterModel.find(filters)
      .populate("studentId")
      .populate("coursesRegisterd")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(startIndex);

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
